// AI Concierge — Supabase Edge Function (Deno runtime).
//
// Proxies chat requests to the Claude API so the Anthropic key never
// touches the client. Grounds every answer in OotyMade's own verified
// content tables (see ../../migrations/0001_content_tables.sql) instead of
// letting the model answer from general knowledge — per the app's
// non-negotiable rule that the concierge must never invent prices,
// timings, permit rules or safety information.
//
// This function is architected as a standalone service (not app-locked)
// so the same retrieval + grounding logic can back the WhatsApp AI Agent
// on AiSensy later — one source of truth, two channels.
//
// NOT YET DEPLOYED. To go live:
//   1. `supabase functions deploy ai-concierge`
//   2. Set secrets: `supabase secrets set ANTHROPIC_API_KEY=... SUPABASE_URL=... SUPABASE_ANON_KEY=...`
//      (SUPABASE_URL / SUPABASE_ANON_KEY are auto-injected by the Supabase
//      runtime in production — only needed manually for local `functions serve`.)

import { createClient } from 'npm:@supabase/supabase-js@2';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
// Fast, inexpensive model — a good fit for a grounded Q&A concierge.
// Check anthropic.com/pricing for the current recommended model before
// relying on this in production; model IDs are periodically retired.
const MODEL = 'claude-haiku-4-5-20251001';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type ChatMessage = { role: 'user' | 'assistant'; content: string };

interface RequestBody {
  message: string;
  history?: ChatMessage[];
  language?: 'en' | 'ta';
}

const SUPPORT_URL = 'https://tourism.ootymade.com';

function buildSystemPrompt(context: string, language: 'en' | 'ta') {
  const languageInstruction =
    language === 'ta'
      ? 'Respond in Tamil, unless the traveller writes in English — then reply in English.'
      : 'Respond in English, unless the traveller writes in Tamil — then reply in Tamil.';

  return `You are the OotyMade AI Concierge, a helpful, warm, practical assistant for tourists visiting Ooty and the Nilgiris. OotyMade is a 14-year-old local heritage brand — write like someone who has actually lived there, not a generic travel bot.

${languageInstruction}

CRITICAL RULES — do not break these:
1. Answer ONLY using the VERIFIED CONTEXT below for facts like prices, timings, opening hours, E-Pass rules, permit requirements, distances, and safety information. Never invent or guess a specific number, rule, or safety claim that isn't in the context.
2. If the traveller asks something the verified context doesn't cover, say so plainly — something like "I don't have a verified answer for that" — and point them to OotyMade support at ${SUPPORT_URL} rather than guessing.
3. You may use general knowledge for non-factual things: conversation, phrasing, general geography sense, or acknowledging what the traveller said. But any concrete fact about Ooty/the Nilgiris must come from the context.
4. Keep answers short and practical — this is a mobile chat, not an essay. Use the traveller's exact situation (weather, time of day if mentioned) where relevant.
5. Never fabricate a restaurant name, business, or trekking route recommendation — the verified context intentionally omits these where OotyMade hasn't verified them yet; say so and suggest ${SUPPORT_URL} instead.

VERIFIED CONTEXT (the only source for facts in your answer):
${context}`;
}

async function fetchVerifiedContext(supabaseUrl: string, supabaseKey: string): Promise<string> {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const [{ data: documents }, { data: attractions }, { data: emergencyContacts }, { data: treks }] =
    await Promise.all([
      supabase.from('content_documents').select('id, data, last_verified'),
      supabase
        .from('attractions')
        .select(
          'name, category, region, distance_from_ooty_km, opening_hours, price_adult, price_child, price_note, best_time_of_day, visit_duration_minutes, accessibility_note, why_locals_rate_it'
        ),
      supabase.from('emergency_contacts').select('label, number, description').order('sort_order'),
      // RLS on trek_routes already restricts this to verified rows only —
      // an unverified route simply won't come back, even with the anon key.
      supabase.from('trek_routes').select('name, region, difficulty, distance_km, duration_hours, permit_note, safety_essentials'),
    ]);

  const sections: string[] = [];

  (documents ?? []).forEach((doc: { id: string; data: unknown; last_verified: string }) => {
    sections.push(`### ${doc.id} (last verified ${doc.last_verified})\n${JSON.stringify(doc.data)}`);
  });

  if (attractions?.length) {
    sections.push(`### attractions\n${JSON.stringify(attractions)}`);
  }

  if (emergencyContacts?.length) {
    sections.push(`### emergency_contacts\n${JSON.stringify(emergencyContacts)}`);
  }

  sections.push(
    treks?.length
      ? `### verified_trek_routes\n${JSON.stringify(treks)}`
      : '### verified_trek_routes\nNone published yet — no trekking route has been personally verified by the OotyMade team. Do not recommend any trekking route; direct the traveller to OotyMade support for guided trek options.'
  );

  return sections.join('\n\n');
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { message, history = [], language = 'en' }: RequestBody = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');

    if (!supabaseUrl || !supabaseKey || !anthropicKey) {
      return new Response(
        JSON.stringify({
          error:
            'ai-concierge is not configured — missing SUPABASE_URL, SUPABASE_ANON_KEY or ANTHROPIC_API_KEY secrets.',
        }),
        { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const context = await fetchVerifiedContext(supabaseUrl, supabaseKey);
    const system = buildSystemPrompt(context, language);

    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': ANTHROPIC_VERSION,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system,
        messages: [...history, { role: 'user', content: message }],
      }),
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: 'The AI concierge is temporarily unavailable.',
          supportUrl: SUPPORT_URL,
        }),
        { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }

    const data = await anthropicResponse.json();
    const reply = data.content?.[0]?.type === 'text' ? data.content[0].text : '';

    return new Response(JSON.stringify({ reply, supportUrl: SUPPORT_URL }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('ai-concierge error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong.', supportUrl: SUPPORT_URL }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    );
  }
});
