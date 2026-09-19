import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripPlan } from '../lib/tripPlanner';
import { cancelTripReminders } from '../lib/notifications';

export interface SavedTripPlan {
  id: string;
  createdAt: string;
  startDate: string | null; // ISO date — null if no reminder was scheduled
  notificationIds: string[];
  plan: TripPlan;
}

interface PlanState {
  savedPlans: SavedTripPlan[];
  savePlan: (plan: TripPlan, startDate: Date | null, notificationIds: string[]) => void;
  removePlan: (id: string) => void;
}

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      savedPlans: [],
      savePlan: (plan, startDate, notificationIds) =>
        set((state) => ({
          savedPlans: [
            {
              id: `${Date.now()}`,
              createdAt: new Date().toISOString(),
              startDate: startDate ? startDate.toISOString() : null,
              notificationIds,
              plan,
            },
            ...state.savedPlans,
          ],
        })),
      removePlan: (id) => {
        const target = get().savedPlans.find((p) => p.id === id);
        if (target?.notificationIds.length) {
          cancelTripReminders(target.notificationIds).catch(() => {});
        }
        set((state) => ({ savedPlans: state.savedPlans.filter((p) => p.id !== id) }));
      },
    }),
    {
      name: 'ootymade-saved-plans',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
