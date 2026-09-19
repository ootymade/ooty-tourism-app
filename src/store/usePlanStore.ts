import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripPlan } from '../lib/tripPlanner';

export interface SavedTripPlan {
  id: string;
  createdAt: string;
  plan: TripPlan;
}

interface PlanState {
  savedPlans: SavedTripPlan[];
  savePlan: (plan: TripPlan) => void;
  removePlan: (id: string) => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      savedPlans: [],
      savePlan: (plan) =>
        set((state) => ({
          savedPlans: [
            { id: `${Date.now()}`, createdAt: new Date().toISOString(), plan },
            ...state.savedPlans,
          ],
        })),
      removePlan: (id) =>
        set((state) => ({ savedPlans: state.savedPlans.filter((p) => p.id !== id) })),
    }),
    {
      name: 'ootymade-saved-plans',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
