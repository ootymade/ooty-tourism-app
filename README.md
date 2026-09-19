# OotyMade — Nilgiris Trip Companion

Cross-platform mobile app (Expo + React Native + TypeScript) — the pocket
problem-solver for tourists in Ooty and the Nilgiris. See the project brief
for full scope, phases and brand guidelines.

## Stack

- Expo (managed) + TypeScript
- React Navigation (bottom tabs + native stack)
- Zustand (local state) + React Query (server state)
- Supabase (Postgres/Auth/Storage/Edge Functions)
- expo-sqlite (offline cache for the Attractions Directory)
- react-native-maps (Explore tab map view)
- Claude API via a Supabase Edge Function proxy (AI concierge)
- Sentry (crash reporting) + PostHog (privacy-respecting analytics), both inert until a key is set
- expo-notifications (local reminders for saved trip plans)

## Getting started

```bash
npm install
cp .env.example .env   # fill in Supabase URL + anon key when a project exists
npm run start           # then press i / a / w, or scan the QR code in Expo Go
```

Without Supabase credentials the app still boots — `src/lib/supabase.ts`
falls back to a placeholder client and logs a warning; no screen depends on
live data yet (everything currently reads from bundled seed data).

**react-native-maps does not work in plain Expo Go.** To see the Explore
tab's map view, build a dev client (`npx expo run:android` / `run:ios`, or
an EAS dev build) — the list view works everywhere. Android also needs a
real Google Maps API key in `app.json` → `expo.android.config.googleMaps.apiKey`
(currently a placeholder) before map tiles will load on that platform.

**Quick visual check without installing anything on your phone:**
`npx expo export --platform web` builds a browser version (verified working
this session, screenshotted, and pushed) — serve the output directory with
any static file server and open it in a browser. `react-native-maps`,
`expo-sqlite` and the rest of the native modules have web-safe fallbacks
(`src/components/AttractionsMap.tsx` vs. `.native.tsx`, and
`metro.config.js` registers the `.wasm` asset extension expo-sqlite's web
build needs) — this is a real, if secondary, supported target, not a hack.
The web build is for previewing only; the product is the native app.

## Project layout

```
src/
  theme/        brand colors, typography, spacing tokens
  components/    shared UI primitives (Screen, Card, Button, ThemedText, ...)
  navigation/    bottom tabs + per-tab stacks
  screens/       one file per screen
  data/          seed content for each module, each with lastVerified/sourceNote
  lib/           supabase client, react-query client, sqlite db, attraction utils,
                 trip planner, AI concierge client
  hooks/         React Query hooks (useAttractions)
  store/         zustand stores (saved trip plans, persisted)
supabase/
  migrations/    SQL schema — mirrors src/data/*.ts, not yet applied to a real project
  seed.sql       the current seed content as INSERT statements
  functions/     ai-concierge Edge Function (Deno) — not yet deployed
  config.toml    Supabase CLI project config
```

## Deploying the backend (not done yet)

Nothing in `supabase/` is deployed — there is no live Supabase project. To
go live:

1. Create a Supabase project, then `supabase link` this repo to it.
2. `supabase db push` (or run `migrations/0001_content_tables.sql` then
   `seed.sql` in the SQL editor) to create and populate the content tables.
   Both were validated against a real local Postgres 16 instance this
   session (migration applies cleanly, all 17 attractions / 4 content docs /
   6 emergency contacts / 2 unverified trek routes insert correctly, and the
   trek RLS policy was confirmed to hide unverified routes from a
   non-superuser role).
3. `supabase secrets set ANTHROPIC_API_KEY=...` (get one from
   console.anthropic.com — never commit it).
4. `supabase functions deploy ai-concierge`.
5. Fill in `.env` with the project's URL and anon key (see `.env.example`).

Until then, the Ask tab's chat UI works and fails gracefully — it shows a
"can't reach the AI concierge yet" message with a link to
tourism.ootymade.com rather than crashing or hanging. The Edge Function
itself was type-checked and linted with `deno check` / `deno lint`
(clean) — it just has nowhere to run yet.

## Content governance

Every factual content module (`src/data/*.ts`) carries a `lastVerified` date
and a `sourceNote`, shown in-app via the `VerifiedBadge` component. Volatile
facts (toy train fares, exact hairpin-bend counts) are given as ranges with a
link to the authoritative source rather than as fixed numbers — a wrong
number is worse than no number. This mirrors the eventual Supabase schema:
each table will carry the same fields so content can be updated from an
admin panel without an app store release.

## Status

- **Phase 0 (scaffold)** — done. Navigation shell, brand design tokens, empty
  screens for all 5 tabs.
- **Phase 1 (static content)** — done. Modules A (E-Pass), B (Toy Train),
  E (Travel & Connectivity), G (Food & Shopping), I (Emergency) built with
  seed content.
- **Phase 2 (Attractions Directory)** — done for the starter set. 17
  attractions across Ooty/Coonoor/Kotagiri/Masinagudi in
  `src/data/attractions.ts`, cached into SQLite on first launch
  (`src/lib/db.ts`), with a filterable/sortable list and a map view in the
  Explore tab. This is a **starter set, not the full 40+ directory** the
  spec calls for — entry fees and hours came from research this session and
  should be reconciled against Vijay's own verified numbers before this
  is treated as launch-ready content.
- **Phase 3 (Trip Planner, rule-based)** — done. `src/lib/tripPlanner.ts`
  sequences attractions by nearest-neighbour distance from the chosen base
  town, respects pace (stops/day) and interests (mapped to attraction
  categories), and deprioritises strenuous stops for senior-friendly
  parties. No AI involved yet — deterministic and predictable, per the
  build order (AI sequencing is layered on top of this same data in
  Phase 5). Plans can be saved (persisted via Zustand + AsyncStorage) and
  shared as a checklist; the "book a cab or guide" CTA deep-links to
  tourism.ootymade.com (a general link — the planner can't pre-fill
  that Wix form's fields without a documented way to do so).
- **Phase 4 (Trekking verification gate)** — done. `src/data/treks.ts`
  defines `TrekRoute` with nullable `verifiedBy`/`verifiedDate`, and
  `getPublishedTreks()` filters out anything without both — a real code
  constraint, not just a content rule. **No trekking route is published
  in this app yet**: the two seed entries are intentionally left
  unverified (trekking safety data is too high-stakes to write from
  general knowledge), so the public Trekking screen currently shows an
  honest "nothing verified yet" state. A `__DEV__`-only toggle previews
  the suppressed entries, clearly marked "NOT PUBLISHED", to prove the
  gate itself works. Someone from OotyMade needs to actually walk a route
  and fill in `verifiedBy`/`verifiedDate`/`safetyEssentials` before
  anything can appear here for real.
- **Phase 5 (AI Concierge)** — code complete, not deployed. Real Supabase
  tables mirroring `src/data/*.ts` (`supabase/migrations/0001_content_tables.sql`
  + `supabase/seed.sql`, both validated against a real local Postgres),
  an Edge Function (`supabase/functions/ai-concierge`) that grounds every
  Claude API call in that verified content and refuses to invent prices,
  timings, permits or safety facts, and a real chat UI in the Ask tab
  (bilingual EN/Tamil toggle, starter prompts, graceful failure to a
  support link when the backend isn't reachable). Needs a Supabase
  project + an Anthropic API key to actually run — see "Deploying the
  backend" below.

  **Until then, the Ask tab runs a local "Demo mode"** (`src/lib/demoConcierge.ts`)
  automatically — a rule-based keyword matcher over the same verified
  content, no network call, no account needed. It's clearly labelled in
  the UI (a banner + no pretense of real AI) and switches itself off the
  moment `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY` are
  set — no code change required. It exists so the chat UX can be
  evaluated for free before committing to Anthropic billing.

  The retrieval layer lives in the Edge Function itself
  (not the app), so the same function can back the WhatsApp AI Agent on
  AiSensy later without duplicating logic.
- **Phase 6 (Polish)** — partially done; the rest needs real accounts this
  session doesn't have (Sentry/PostHog projects, Apple/Google developer
  accounts, real brand icon/splash art, a physical device or simulator to
  test on). What's done:
  - **Crash reporting** — `@sentry/react-native` wired in `App.tsx` via
    `src/lib/sentry.ts`, reading `EXPO_PUBLIC_SENTRY_DSN`. Disabled (no
    network calls) until a real DSN is set. The build-time source-map-upload
    config plugin was deliberately *not* added to `app.json` — with no real
    Sentry org/project it risked breaking `expo prebuild`/EAS builds for no
    benefit; add `@sentry/react-native/expo` to `plugins` once real
    credentials exist.
  - **Analytics** — `posthog-react-native` wired via `src/lib/analytics.ts`,
    reading `EXPO_PUBLIC_POSTHOG_KEY`. No client is even constructed without
    a key, so there's no tracking of any kind out of the box. Tracks screen
    views (via a navigation state listener) plus three product events
    (`trip_plan_generated`, `trip_plan_saved`, `attraction_viewed`) — no PII.
  - **Push notifications** — `expo-notifications` wired via
    `src/lib/notifications.ts`. These are local, device-scheduled
    notifications, not remote push, so they need no backend or account:
    saving a plan can schedule a "trip starts today" reminder and a
    "starts in 1 hour" reminder before the first stop, based on a
    "starts in N days" selector in the Plan tab's save flow. Reminders are
    cancelled automatically when a saved plan is deleted.
  - **Accessibility** — fixed two real WCAG AA contrast failures (Heritage
    Gold and the success green both failed as text color on cream/white;
    added an `accentText` token and darkened `success`/`warning` slightly —
    verified with a real luminance-ratio calculation, not eyeballed). Added
    `accessibilityRole`/`accessibilityLabel`/`accessibilityState` to every
    icon-only touch target across the app (list/map toggle, stepper +/-,
    send button, delete-plan icon, etc.) — previously several icon-only
    buttons had no accessible name at all. Confirmed font scaling isn't
    disabled anywhere.
  - **Not done**: push notification *certificates* (not needed — these are
    local-only), remote analytics dashboards, app icon/splash art, store
    listings/screenshots, TestFlight/Play internal testing, and any testing
    on an actual device or simulator (everything here was verified via
    `tsc --noEmit` and a full Metro bundle export, never a running app).

Before a store submission, confirm the final app name/icon with Vijay —
`app.json` currently uses "OotyMade — Nilgiris Trip Companion" and the
default Expo template icon/splash assets as placeholders.
