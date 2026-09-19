# OotyMade — Nilgiris Trip Companion

Cross-platform mobile app (Expo + React Native + TypeScript) — the pocket
problem-solver for tourists in Ooty and the Nilgiris. See the project brief
for full scope, phases and brand guidelines.

## Stack

- Expo (managed) + TypeScript
- React Navigation (bottom tabs + native stack)
- Zustand (local state) + React Query (server state)
- Supabase (Postgres/Auth/Storage/Edge Functions)
- Claude API via a Supabase Edge Function proxy (AI concierge, Phase 5)

## Getting started

```bash
npm install
cp .env.example .env   # fill in Supabase URL + anon key when a project exists
npm run start           # then press i / a / w, or scan the QR code in Expo Go
```

Without Supabase credentials the app still boots — `src/lib/supabase.ts`
falls back to a placeholder client and logs a warning; no screen depends on
live data yet.

## Project layout

```
src/
  theme/        brand colors, typography, spacing tokens
  components/    shared UI primitives (Screen, Card, Button, ThemedText)
  navigation/    bottom tabs + per-tab stacks
  screens/       one file per screen (currently placeholders)
  lib/           supabase client, react-query client
  store/         zustand stores
```

## Status

Phase 0 (scaffold) is complete: navigation shell, brand design tokens, and
empty screens for all 5 tabs (Home, Explore, Plan, Travel, Ask) plus the
secondary screens (Food & Shopping, Emergency & Utilities, Settings).

Before a store submission, confirm the final app name/icon with Vijay —
`app.json` currently uses "OotyMade — Nilgiris Trip Companion" and the
default Expo template icon/splash assets as placeholders.
