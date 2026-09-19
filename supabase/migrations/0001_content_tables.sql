-- Content tables for OotyMade's static content modules (A, B, E, G, I) and
-- the Attractions Directory (C) / Trekking gate (F). Mirrors the shapes in
-- src/data/*.ts so the app's Phase-1..4 seed data can migrate here without
-- changing screen code — only the data-fetching layer (src/lib/db.ts,
-- src/hooks/*) needs to switch from bundled JSON to a Supabase fetch.
--
-- Every table carries a verification trail, per the app's non-negotiable
-- content governance rule: nothing is treated as permanently true.

-- Singleton "document" content: E-Pass, Toy Train, Connectivity, Shopping.
-- One row per module, content itself stored as jsonb since each module's
-- shape is bespoke (steps, FAQs, routes, etc.) and doesn't need to be
-- queried field-by-field the way attractions do.
create table if not exists content_documents (
  id text primary key, -- 'epass' | 'toy_train' | 'connectivity' | 'shopping'
  data jsonb not null,
  last_verified date not null,
  source_note text not null,
  updated_at timestamptz not null default now()
);

create table if not exists emergency_contacts (
  id bigint generated always as identity primary key,
  label text not null,
  number text not null,
  description text not null,
  sort_order int not null default 0,
  last_verified date not null,
  source_note text not null
);

create table if not exists attractions (
  id text primary key,
  name text not null,
  category text not null,
  region text not null,
  distance_from_ooty_km numeric not null,
  latitude numeric not null,
  longitude numeric not null,
  opening_hours jsonb not null, -- [{ opens: "HH:MM", closes: "HH:MM" }, ...]
  price_adult text not null,
  price_child text not null,
  price_note text,
  best_time_of_day text not null,
  visit_duration_minutes int not null,
  accessibility_note text not null,
  why_locals_rate_it text not null,
  last_verified date not null,
  source_note text not null,
  updated_at timestamptz not null default now()
);

-- Trek routes: the verification gate is enforced in the app
-- (getPublishedTreks()) by requiring both verified_by and verified_date,
-- but it's worth mirroring that intent here — a NULL in either column
-- means "do not surface this route to tourists."
create table if not exists trek_routes (
  id text primary key,
  name text not null,
  region text not null,
  difficulty text not null,
  distance_km numeric not null,
  duration_hours numeric not null,
  best_season text not null,
  permit_required boolean not null default false,
  permit_note text not null,
  safety_essentials jsonb not null default '[]'::jsonb,
  verified_by text, -- NULL = unverified, must not render publicly
  verified_date date, -- NULL = unverified, must not render publicly
  updated_at timestamptz not null default now()
);

-- Row Level Security: content is public-read (it's a tourist-facing app
-- with no user accounts yet), write access is service-role only (the
-- admin panel / Supabase table editor uses the service key, never the
-- anon key used by the app).
alter table content_documents enable row level security;
alter table emergency_contacts enable row level security;
alter table attractions enable row level security;
alter table trek_routes enable row level security;

create policy "Public read access" on content_documents for select using (true);
create policy "Public read access" on emergency_contacts for select using (true);
create policy "Public read access" on attractions for select using (true);
-- Trek routes: only expose rows that pass the verification gate to the
-- anon (public app) role. The service role bypasses RLS entirely, so the
-- admin preview described in the app's Trekking screen still works from
-- server-side tooling.
create policy "Public read access to verified routes only" on trek_routes
  for select using (verified_by is not null and verified_date is not null);
