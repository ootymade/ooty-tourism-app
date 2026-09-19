import { useQuery } from '@tanstack/react-query';
import { getAllAttractions, getAttractionById } from '../lib/db';

export function useAttractions() {
  return useQuery({
    queryKey: ['attractions'],
    queryFn: getAllAttractions,
    staleTime: Infinity, // seed data only changes when the app updates, for now
  });
}

export function useAttraction(id: string | undefined) {
  return useQuery({
    queryKey: ['attraction', id],
    queryFn: () => getAttractionById(id as string),
    enabled: Boolean(id),
  });
}
