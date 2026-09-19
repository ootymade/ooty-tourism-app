import { Attraction, OpeningWindow } from '../data';

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function isOpenNow(attraction: Attraction, now: Date = new Date()): boolean {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return attraction.openingHours.some((window: OpeningWindow) => {
    const opens = toMinutes(window.opens);
    const closes = toMinutes(window.closes);
    return nowMinutes >= opens && nowMinutes <= closes;
  });
}

export function formatOpeningHours(openingHours: OpeningWindow[]): string {
  return openingHours.map((w) => `${formatTime(w.opens)} – ${formatTime(w.closes)}`).join(', ');
}

function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

export type SortKey = 'distance' | 'duration' | 'name';

export function sortAttractions(attractions: Attraction[], sortKey: SortKey): Attraction[] {
  const sorted = [...attractions];
  switch (sortKey) {
    case 'distance':
      return sorted.sort((a, b) => a.distanceFromOotyKm - b.distanceFromOotyKm);
    case 'duration':
      return sorted.sort((a, b) => a.visitDurationMinutes - b.visitDurationMinutes);
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}
