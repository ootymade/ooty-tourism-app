// Every factual content module carries a lastVerified date and a source
// note, per the app's content governance rule: nothing here is presented
// as permanent truth, and volatile facts (fees, timings) always point the
// user to the authoritative source rather than being the source themselves.

export interface VerifiedContent {
  lastVerified: string; // ISO date, e.g. "2026-09-19"
  sourceNote: string;
}
