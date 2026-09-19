import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TripPlan } from './tripPlanner';

// Local (device-scheduled) notifications — no Expo push token, no backend,
// no account needed. Used sparingly, per the brief: a reminder that a
// saved plan is starting, never marketing pushes.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

// Schedules two reminders for a saved plan's start date: one for the
// morning of day 1, one an hour before the first stop's arrival time.
// Returns the scheduled notification IDs so they can be cancelled if the
// plan is later deleted.
export async function scheduleTripReminders(plan: TripPlan, startDate: Date): Promise<string[]> {
  if (Platform.OS === 'web') return []; // scheduled local notifications aren't supported on web

  const granted = await requestNotificationPermission();
  if (!granted) return [];

  const ids: string[] = [];
  const firstDay = plan.days[0];
  const firstStop = firstDay?.stops[0];

  const morningOf = new Date(startDate);
  morningOf.setHours(7, 0, 0, 0);
  if (morningOf.getTime() > Date.now()) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your Ooty trip starts today',
        body: firstStop
          ? `First stop: ${firstStop.attraction.name} at ${firstStop.arriveTime}.`
          : 'Open OotyMade to see your day-by-day plan.',
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: morningOf },
    });
    ids.push(id);
  }

  if (firstStop) {
    const oneHourBefore = new Date(startDate);
    oneHourBefore.setHours(firstStop.arriveHour, firstStop.arriveMinute, 0, 0);
    oneHourBefore.setMinutes(oneHourBefore.getMinutes() - 60);
    if (oneHourBefore.getTime() > Date.now()) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Your day-plan starts in 1 hour',
          body: `${firstStop.attraction.name} — arrive around ${firstStop.arriveTime}.`,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: oneHourBefore },
      });
      ids.push(id);
    }
  }

  return ids;
}

export async function cancelTripReminders(notificationIds: string[]): Promise<void> {
  await Promise.all(notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}
