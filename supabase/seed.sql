-- Seed data mirroring src/data/*.ts as of 2026-09-19. Run after
-- 0001_content_tables.sql against a real Supabase project
-- (`supabase db reset` locally, or paste into the SQL editor).
-- This is the SAME starter content already bundled in the app —
-- migrating it here doesn't change what's shown, only where it's read from.

-- ---------------------------------------------------------------------
-- content_documents
-- ---------------------------------------------------------------------

insert into content_documents (id, data, last_verified, source_note) values
('epass', $json$
{
  "officialPortalUrl": "https://epass.tnega.org",
  "summary": "The Nilgiris E-Pass is a free online entry pass for private vehicles entering the district. It is checked at road checkposts and is separate from the small cash vehicle-entry fee collected at the checkpost itself. Apply before you reach the checkpost, not after — there is no on-the-spot registration counter for tourists.",
  "whoNeedsIt": [
    "Private (non-commercial) vehicles without a TN-43 (Nilgiris) registration number",
    "Self-drive tourists entering from Kerala or Karnataka as well as within Tamil Nadu",
    "Rental cars and self-driven vehicles booked from outside the district"
  ],
  "whoIsExempt": [
    "Vehicles registered under TN-43 (Nilgiris district)",
    "Passengers travelling by TNSTC/KSRTC government bus",
    "Passengers travelling on the Nilgiri Mountain Railway (toy train)",
    "Emergency vehicles and government duty vehicles",
    "Residents of the Nilgiris district"
  ],
  "steps": [
    "Open epass.tnega.org on your phone or laptop before you travel.",
    "Choose \"Within India\" (or \"Outside India\" if you hold a foreign passport).",
    "Enter your mobile number and verify with the OTP sent by SMS.",
    "Fill in your vehicle registration number, number of passengers, travel dates, and the address you are staying at.",
    "Submit the form and download the approved E-Pass PDF — it has a QR code that is scanned at the checkpost.",
    "Keep a screenshot of the QR code as a backup in case of patchy signal at the checkpost."
  ],
  "faqs": [
    {"question": "Is the E-Pass the same as the vehicle entry fee?", "answer": "No. The E-Pass itself is free. A separate small cash entry fee is collected for your vehicle at the checkpost — this is not paid online."},
    {"question": "What happens if I arrive without an E-Pass?", "answer": "Expect delays at the checkpost while staff help you register on the spot if possible, or you may be asked to complete it before proceeding — this depends on checkpost traffic and current enforcement, so it is best not to rely on it."},
    {"question": "Can one E-Pass cover a family or group travelling together in one car?", "answer": "Yes — the form asks for total passenger count for the vehicle, so one application covers everyone travelling in that car."},
    {"question": "How long is the E-Pass valid for?", "answer": "It is tied to the travel dates you enter on the form, not open-ended — apply for the specific dates of your trip."},
    {"question": "Is there a daily limit on how many vehicles are allowed in?", "answer": "Yes, entries are capped per day and can fill up on weekends and holidays, so apply a few days ahead if you can rather than the morning you travel."}
  ]
}
$json$::jsonb, '2026-09-19', 'Compiled from the official Nilgiris district e-pass portal and OotyMade''s own visitor guide. Rules, fees and enforcement can change without notice — always confirm on the official portal before you travel, especially around peak season.'),

('toy_train', $json$
{
  "irctcUrl": "https://www.irctc.co.in",
  "summary": "The Nilgiri Mountain Railway (NMR) is the UNESCO World Heritage rack-and-pinion toy train connecting Mettupalayam, at the foot of the hills, to Coonoor and Ooty. It is one of the steepest railways in Asia and the ride itself — not just the destination — is the point.",
  "stations": [
    {"name": "Mettupalayam", "code": "MTP"},
    {"name": "Coonoor", "code": "ONR"},
    {"name": "Ooty (Udagamandalam)", "code": "UAM"}
  ],
  "legs": [
    {"from": "Mettupalayam", "to": "Ooty", "departsApprox": "~7:10 AM", "arrivesApprox": "~12:00 PM", "durationApprox": "About 4h 45m"},
    {"from": "Ooty", "to": "Mettupalayam", "departsApprox": "~2:00 PM", "arrivesApprox": "~5:30 PM", "durationApprox": "About 3h 30m"}
  ],
  "fareNote": "Fares vary by class (First Class vs Second Class) and by season, and are not reproduced here to avoid quoting stale numbers — check current fares directly on IRCTC when you book.",
  "bookingTips": [
    "Book on IRCTC under the station codes MTP (Mettupalayam), ONR (Coonoor) and UAM (Ooty).",
    "The Mettupalayam–Ooty and Coonoor–Ooty legs sell out fast in peak season (April–June, and around Christmas/New Year) — book as early as IRCTC allows, typically up to 120 days ahead.",
    "First Class has forward-facing, better window seats; Second Class is more affordable but seating is bench-style.",
    "If the direct train is sold out, the Coonoor–Ooty short leg is a shorter, often easier-to-book alternative that still covers the most scenic stretch.",
    "Tatkal-style short-notice booking exists but is limited — do not count on getting a same-week seat in peak season."
  ]
}
$json$::jsonb, '2026-09-19', 'Timings are the long-running scheduled service pattern reported by IRCTC and rail enquiry sources; they shift with season, maintenance blocks and special trains, so treat them as indicative and always re-check on IRCTC before booking or planning your day around them.'),

('connectivity', $json$
{
  "airport": {
    "name": "Coimbatore International Airport",
    "code": "CJB",
    "routes": [
      {"label": "Via Mettupalayam & Coonoor (most common)", "distanceApprox": "~85–90 km", "durationApprox": "~3.5–4 hours by road", "note": "Flat, four-lane road to Mettupalayam, then the Coonoor ghat with its well-known hairpin bends up to Ooty."},
      {"label": "Via Mysore / Gudalur (from Karnataka side)", "distanceApprox": "Longer than the CJB route", "durationApprox": "Varies by origin", "note": "Relevant if you are coming from Bangalore/Mysore rather than flying into Coimbatore."},
      {"label": "Via Masinagudi / Sigur Ghat", "distanceApprox": "Shorter cut-through from Mudumalai side", "durationApprox": "Saves roughly 30 km versus the Gudalur ghat", "note": "Useful if you are combining Ooty with Mudumalai National Park."}
    ]
  },
  "railStations": [
    {"name": "Mettupalayam", "note": "Where the Nilgiri Mountain Railway toy train begins — most travellers connect here from the Coimbatore/Chennai broad-gauge network."},
    {"name": "Coimbatore Junction", "note": "The nearest major broad-gauge station with wide connectivity; from here it is road or a connecting train to Mettupalayam to pick up the toy train."}
  ],
  "busInfo": {
    "operators": ["TNSTC (Tamil Nadu)", "KSRTC (Karnataka)"],
    "majorOriginCities": ["Coimbatore", "Chennai", "Bangalore", "Mysore", "Kochi"],
    "note": "Frequency is generally good from Coimbatore (multiple buses through the day) and thins out on longer routes like Chennai and Bangalore, which are mostly overnight services — check current timings with TNSTC/KSRTC directly, as schedules shift seasonally."
  },
  "localTransport": {
    "summary": "Ooty runs on a local taxi-union fixed-rate structure rather than app-based ride-hailing.",
    "points": [
      "Uber and Ola generally do not operate within Ooty town — this is normal, not a sign something is wrong with the app.",
      "Local taxi unions operate at fixed rates by destination/route, negotiated at your hotel, a taxi stand, or by phone.",
      "Auto-rickshaws cover short in-town hops; for day trips to attractions outside town, a taxi union car or a pre-booked driver is the norm.",
      "Ask your hotel for their tied-up driver's contact — it is usually the simplest way to get a fair local rate."
    ]
  },
  "ghatRoadGuide": {
    "summary": "The main approach from Mettupalayam/Coimbatore is the Coonoor ghat road, a narrow, numbered-hairpin climb that gains most of the altitude in a short stretch.",
    "tips": [
      "If you get motion sickness, take a tablet 30–45 minutes before the ghat starts climbing, not after you feel unwell.",
      "Sit toward the front of the vehicle and keep your eyes on the road ahead rather than a phone screen.",
      "Give yourself more time than a straight-line distance suggests — hairpin sections are slow by design, not due to traffic.",
      "Landslides and road closures do happen in heavy monsoon — check current road status before a monsoon-season trip rather than assuming the road you took last time is open."
    ],
    "roadConditionUrl": "https://nilgiris.nic.in"
  }
}
$json$::jsonb, '2026-09-19', 'Distances and drive times are approximate and depend on traffic, weather and the exact starting point — treat them as planning ranges, not promises, especially on the ghat sections.'),

('shopping', $json$
{
  "intro": "A few things are genuinely worth carrying home from the Nilgiris. Buy from a shop you trust, whether that's us or someone else — here's what to look for.",
  "items": [
    {"name": "Ooty Varkey", "description": "A crisp, layered local biscuit and a GI (Geographical Indication) tagged Nilgiris product — the genuine version is made locally, not mass-produced.", "giTagged": true},
    {"name": "Nilgiris Tea", "description": "High-altitude tea from Nilgiris estates, known for a brisk, aromatic character distinct from Assam or Darjeeling tea.", "giTagged": true},
    {"name": "Handmade Chocolate", "description": "Small-batch chocolate made by local Nilgiris producers — worth seeking out over mass-market brands sold in tourist-strip shops.", "giTagged": false},
    {"name": "Eucalyptus Oil", "description": "Distilled from Nilgiris-grown eucalyptus; genuine oil is pale, strongly scented and sold in small glass bottles — a common thing to be sold a diluted version of, so buy from a source you trust.", "giTagged": false}
  ],
  "ootymadeUrl": "https://ootymade.com",
  "disclosure": "These are OotyMade's own products, made and sourced by us — shown here as our brand, not as a neutral third-party recommendation."
}
$json$::jsonb, '2026-09-19', 'OotyMade brand and product knowledge — not scraped from third-party listings.')
on conflict (id) do update set
  data = excluded.data,
  last_verified = excluded.last_verified,
  source_note = excluded.source_note,
  updated_at = now();

-- ---------------------------------------------------------------------
-- emergency_contacts
-- ---------------------------------------------------------------------

insert into emergency_contacts (label, number, description, sort_order, last_verified, source_note) values
('Police', '100', 'All-India police emergency number.', 1, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.'),
('Ambulance', '108', 'Free emergency medical response and ambulance.', 2, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.'),
('Fire', '101', 'All-India fire and rescue services.', 3, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.'),
('Women''s Helpline', '181', '24x7 helpline for women in distress.', 4, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.'),
('Disaster Management', '1077', 'State disaster management helpline (landslides, flooding).', 5, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.'),
('National Emergency Number', '112', 'Single number covering police, fire and ambulance if you are unsure which to call.', 6, '2026-09-19', 'Standardised nationwide (and Tamil Nadu state) emergency helpline numbers — work the same across India, not just in the Nilgiris.')
on conflict do nothing;

-- ---------------------------------------------------------------------
-- attractions
-- ---------------------------------------------------------------------

insert into attractions (id, name, category, region, distance_from_ooty_km, latitude, longitude, opening_hours, price_adult, price_child, price_note, best_time_of_day, visit_duration_minutes, accessibility_note, why_locals_rate_it, last_verified, source_note) values
('ooty-lake', 'Ooty Lake', 'lake', 'Ooty', 1, 11.4058, 76.6934, '[{"opens":"09:00","closes":"18:00"}]', '₹20–30', '₹20–30', 'Boating is extra and charged per boat (roughly ₹950–1,650 depending on boat size), not per person.', 'Early morning or just before sunset', 60, 'Flat paved paths around most of the lake; boat jetty has a few steps.', 'The horseshoe walk around the lake at golden hour is still the easiest, prettiest hour in Ooty.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('botanical-garden', 'Government Botanical Garden', 'garden', 'Ooty', 2.5, 11.4136, 76.7098, '[{"opens":"08:00","closes":"18:30"}]', '₹30', '₹15', 'DSLR/tripod camera fee charged separately; phone photography is free.', 'Morning, before tour groups arrive', 75, 'Paved terraced paths with some gradient; not fully wheelchair-friendly on the upper terraces.', 'A 20-million-year-old fossil tree and the widest variety of exotic and native trees in one place in Ooty.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('rose-garden', 'Government Rose Garden', 'garden', 'Ooty', 4.7, 11.4008, 76.7057, '[{"opens":"08:00","closes":"18:30"}]', '₹30', '₹15', null, 'Morning', 50, 'Terraced slopes with steps; moderate walking.', 'One of India''s largest rose collections — genuinely worth it if you time a visit near the flower show.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('doddabetta-peak', 'Doddabetta Peak', 'viewpoint', 'Ooty', 9, 11.4064, 76.7397, '[{"opens":"07:00","closes":"18:00"}]', '₹10–15', '₹10–15', 'Telescope House at the summit charges extra; still/video camera fees also apply separately.', 'Early morning, before clouds roll in over the peak', 60, 'Paved path to the summit car park; telescope house has a short flight of steps.', 'The highest point in the Nilgiris — on a clear morning the 360° view is worth the early start.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('wax-museum', 'Wax Museum', 'museum', 'Ooty', 2, 11.4082, 76.6961, '[{"opens":"09:00","closes":"20:00"}]', '₹30', '₹20', null, 'Any time — a good rainy-day option', 40, 'Indoor, mostly flat, easy walking.', 'A reliable fallback when the weather turns — quick, indoor, and close to the lake.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('thread-garden', 'Thread Garden', 'museum', 'Ooty', 1, 11.4062, 76.6929, '[{"opens":"09:00","closes":"18:00"}]', '₹30', '₹15', null, 'Any time', 25, 'Indoor, flat, easy walking.', 'Hundreds of hand-threaded flowers made entirely from thread — a genuinely unusual half hour, right opposite the lake.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('st-stephens-church', 'St. Stephen''s Church', 'heritage', 'Ooty', 2, 11.4131, 76.6947, '[{"opens":"09:00","closes":"13:00"},{"opens":"15:00","closes":"17:00"}]', 'Free', 'Free', null, 'Late afternoon light through the stained glass', 25, 'Flat entrance; closed over lunch hours, so time your visit.', 'One of the oldest churches in the Nilgiris — quiet, and usually free of tour-bus crowds.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('pykara-lake-falls', 'Pykara Lake & Falls', 'waterfall', 'Ooty', 21, 11.5100, 76.6260, '[{"opens":"09:00","closes":"17:30"}]', '₹20–30', '₹20–30', 'Boating at the lake and the falls viewpoint have separate, small entry charges.', 'Morning, before the Ooty–Mysore highway traffic picks up', 100, 'Steps down to the falls viewpoint; can be slippery in wet weather.', 'The drive out through the Mukurthi forest edge is as good as the falls themselves.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('avalanche-lake', 'Avalanche Lake', 'lake', 'Ooty', 28, 11.3450, 76.5850, '[{"opens":"08:00","closes":"15:00"}]', 'Forest Dept entry fee — check at the gate', 'Forest Dept entry fee — check at the gate', 'Inside the Nilgiri Biosphere Reserve — private vehicles are not allowed in; you transfer to a Forest Department bus at the checkpost. Special activities (camping, filming) need prior permission from the Ooty Forest Office.', 'Early morning', 180, 'Involves a Forest Department bus transfer and some walking at the lake — not a quick stop.', 'The closest thing to untouched Nilgiri forest you can visit without a trekking permit.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('kalhatti-falls', 'Kalhatti Falls', 'waterfall', 'Ooty', 13, 11.4700, 76.7150, '[{"opens":"08:00","closes":"18:00"}]', 'Free', 'Free', 'Reaching the falls involves roughly a 3 km walk/trek from Kalhatti village.', 'Just after monsoon, for full flow', 90, 'Requires a moderate uphill walk — not suitable for limited mobility.', 'Far fewer tour buses than the in-town waterfalls, on the scenic Sigur Ghat road toward Masinagudi.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('mudumalai-sanctuary', 'Mudumalai Wildlife Sanctuary', 'wildlife', 'Masinagudi', 65, 11.5900, 76.5300, '[{"opens":"06:30","closes":"10:00"},{"opens":"14:00","closes":"17:00"}]', 'Safari fee at the gate — check current rate', 'Safari fee at the gate — check current rate', 'Private vehicles are not allowed on safari routes; you go in on a Forest Department bus or booked jeep safari. Elephant rides (where running) are a separate ~30-minute slot.', 'The 6:30–10:00 AM safari slot for the best wildlife activity', 240, 'Safari vehicle transport — minimal walking required, but not a short visit.', 'A real chance at elephant and deer sightings without leaving the Nilgiris district.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('sims-park', 'Sim''s Park', 'garden', 'Coonoor', 20, 11.3520, 76.7960, '[{"opens":"08:00","closes":"18:00"}]', '₹75', '₹40', 'Camera charges (₹200 still / ₹500 video) and boating (~₹50–60/ride) are extra.', 'Morning', 60, 'Terraced garden with slopes; paved main paths.', 'Coonoor''s answer to the Botanical Garden, and usually far less crowded.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('dolphins-nose', 'Dolphin''s Nose', 'viewpoint', 'Coonoor', 32, 11.3020, 76.7660, '[{"opens":"09:00","closes":"18:00"}]', '₹15', '₹15', null, 'Clear mornings, for the Catherine Falls view across the valley', 40, 'Short walk from the car park to the viewpoint railing.', 'On a clear day you see Catherine Falls dropping in the distance — genuinely dramatic, not just a name.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('lambs-rock', 'Lamb''s Rock', 'viewpoint', 'Coonoor', 31, 11.3080, 76.7720, '[{"opens":"09:00","closes":"18:00"}]', '₹15', '₹15', null, 'Morning', 30, 'Short, easy walk from parking.', 'Usually clubbed with Dolphin''s Nose since it''s a 1 km hop between the two — tea estates all the way down.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('catherine-falls', 'Catherine Falls', 'waterfall', 'Kotagiri', 33, 11.3350, 76.7500, '[{"opens":"09:00","closes":"18:30"}]', 'Free', 'Free', 'The roadside viewpoint sees the falls from a distance; reaching the base is a longer, harder trek.', 'Post-monsoon, for full flow', 30, 'Roadside viewpoint is easy; going to the base of the falls is a steep, unmarked trek not recommended without a local guide.', 'Tamil Nadu''s second-highest waterfall, and most visitors only ever see it from the easy roadside stop.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('droog-fort', 'Droog Fort', 'heritage', 'Coonoor', 34, 11.3600, 76.7350, '[{"opens":"07:00","closes":"17:00"}]', 'Free', 'Free', 'Reaching the fort ruins is a roughly 4 km trek down from Nonsuch Estate — this is a hike, not a drive-up stop.', 'Morning, to avoid afternoon mist', 150, 'Moderate trek with uneven terrain — needs reasonable fitness and proper footwear.', 'Tipu Sultan''s old watch-post ruins with a view over the plains — a proper short hike, not a tour-bus stop.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.'),
('kodanad-viewpoint', 'Kodanad Viewpoint', 'viewpoint', 'Kotagiri', 47, 11.4550, 76.8450, '[{"opens":"08:00","closes":"18:00"}]', 'Free', 'Free', null, 'Clear mornings for views toward the Moyar valley and Bhavanisagar', 40, 'Short walk from parking to the viewing platform.', 'The furthest-out viewpoint most tourists reach — fewer crowds and one of the widest views in the district.', '2026-09-19', 'OotyMade guides, cross-checked against independent travel sources.')
on conflict (id) do update set
  name = excluded.name, category = excluded.category, region = excluded.region,
  distance_from_ooty_km = excluded.distance_from_ooty_km, latitude = excluded.latitude, longitude = excluded.longitude,
  opening_hours = excluded.opening_hours, price_adult = excluded.price_adult, price_child = excluded.price_child,
  price_note = excluded.price_note, best_time_of_day = excluded.best_time_of_day,
  visit_duration_minutes = excluded.visit_duration_minutes, accessibility_note = excluded.accessibility_note,
  why_locals_rate_it = excluded.why_locals_rate_it, last_verified = excluded.last_verified,
  source_note = excluded.source_note, updated_at = now();

-- ---------------------------------------------------------------------
-- trek_routes — intentionally left UNVERIFIED (verified_by/verified_date
-- NULL), same as src/data/treks.ts. Do not fill these in without an
-- actual in-person route verification — see that file's comment.
-- ---------------------------------------------------------------------

insert into trek_routes (id, name, region, difficulty, distance_km, duration_hours, best_season, permit_required, permit_note, safety_essentials, verified_by, verified_date) values
('kotagiri-kodanad-trail', 'Kotagiri to Kodanad forest trail', 'Kotagiri', 'moderate', 12, 5, 'Needs verification', true, 'Likely needs Forest Department clearance — not yet confirmed.', '[]'::jsonb, null, null),
('avalanche-upper-bhavani-trek', 'Avalanche to Upper Bhavani', 'Ooty (Nilgiri Biosphere Reserve)', 'strenuous', 18, 8, 'Needs verification', true, 'Inside the Biosphere Reserve — needs Forest Office permission, details not yet confirmed.', '[]'::jsonb, null, null)
on conflict (id) do nothing;
