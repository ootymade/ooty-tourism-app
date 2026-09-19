import { useState } from 'react';
import { Linking, Share, StyleSheet, Switch, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen, ThemedText, Card, Button, FilterChip, Stepper } from '../components';
import {
  BaseLocation,
  Interest,
  Pace,
  PartyType,
  TripPlan,
  generateTripPlan,
  planToChecklistText,
} from '../lib/tripPlanner';
import { usePlanStore } from '../store/usePlanStore';
import { scheduleTripReminders } from '../lib/notifications';
import { trackEvent } from '../lib/analytics';
import { colors, spacing } from '../theme';

const PARTY_OPTIONS: { value: PartyType; label: string }[] = [
  { value: 'couple', label: 'Couple' },
  { value: 'family', label: 'Family' },
  { value: 'group', label: 'Group' },
  { value: 'senior-friendly', label: 'Senior-friendly' },
];

const PACE_OPTIONS: { value: Pace; label: string }[] = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'packed', label: 'Packed' },
];

const INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: 'nature', label: 'Nature' },
  { value: 'heritage', label: 'Heritage' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'food', label: 'Food' },
  { value: 'adventure', label: 'Adventure' },
];

const BASE_OPTIONS: { value: BaseLocation; label: string }[] = [
  { value: 'Ooty', label: 'Ooty' },
  { value: 'Coonoor', label: 'Coonoor' },
  { value: 'Kotagiri', label: 'Kotagiri' },
];

type DaysBucket = '1' | '2' | '3+';

export function PlanScreen() {
  const [daysBucket, setDaysBucket] = useState<DaysBucket>('2');
  const [extraDays, setExtraDays] = useState(3);
  const [party, setParty] = useState<PartyType>('couple');
  const [pace, setPace] = useState<Pace>('relaxed');
  const [interests, setInterests] = useState<Interest[]>(['nature']);
  const [base, setBase] = useState<BaseLocation>('Ooty');
  const [plan, setPlan] = useState<TripPlan | null>(null);

  const savedPlans = usePlanStore((s) => s.savedPlans);
  const savePlan = usePlanStore((s) => s.savePlan);
  const removePlan = usePlanStore((s) => s.removePlan);

  function toggleInterest(interest: Interest) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function handleGenerate() {
    const days = daysBucket === '1' ? 1 : daysBucket === '2' ? 2 : extraDays;
    setPlan(generateTripPlan({ days, party, pace, interests, base }));
    trackEvent('trip_plan_generated', { days, party, pace, base, interestCount: interests.length });
  }

  async function handleShare(planToShare: TripPlan) {
    await Share.share({ message: planToChecklistText(planToShare) });
  }

  async function handleSave(planToSave: TripPlan, startInDays: number | null) {
    let notificationIds: string[] = [];
    let startDate: Date | null = null;

    if (startInDays !== null) {
      startDate = new Date();
      startDate.setDate(startDate.getDate() + startInDays);
      notificationIds = await scheduleTripReminders(planToSave, startDate);
    }

    savePlan(planToSave, startDate, notificationIds);
    trackEvent('trip_plan_saved', { days: planToSave.days.length, reminderSet: notificationIds.length > 0 });
  }

  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        Plan
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        Tell us the shape of your trip — we'll sequence stops by distance so you're not
        zig-zagging across the hills.
      </ThemedText>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        How many days?
      </ThemedText>
      <View style={styles.chipRow}>
        {(['1', '2', '3+'] as DaysBucket[]).map((bucket) => (
          <FilterChip
            key={bucket}
            label={bucket === '3+' ? '3+ days' : `${bucket} day${bucket === '2' ? 's' : ''}`}
            selected={daysBucket === bucket}
            onPress={() => setDaysBucket(bucket)}
          />
        ))}
      </View>
      {daysBucket === '3+' ? (
        <View style={styles.stepperWrap}>
          <Stepper
            value={extraDays}
            min={3}
            max={6}
            onChange={setExtraDays}
            suffix="days"
            label="Number of days"
          />
        </View>
      ) : null}

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Who's travelling?
      </ThemedText>
      <View style={styles.chipRow}>
        {PARTY_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={party === opt.value}
            onPress={() => setParty(opt.value)}
          />
        ))}
      </View>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Pace
      </ThemedText>
      <View style={styles.chipRow}>
        {PACE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={pace === opt.value}
            onPress={() => setPace(opt.value)}
          />
        ))}
      </View>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Interests
      </ThemedText>
      <View style={styles.chipRow}>
        {INTEREST_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={interests.includes(opt.value)}
            onPress={() => toggleInterest(opt.value)}
          />
        ))}
      </View>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Starting from
      </ThemedText>
      <View style={styles.chipRow}>
        {BASE_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={base === opt.value}
            onPress={() => setBase(opt.value)}
          />
        ))}
      </View>

      <Button label="Build my itinerary" onPress={handleGenerate} style={styles.generateButton} />

      {plan ? (
        <ItineraryView plan={plan} onSave={(startInDays) => handleSave(plan, startInDays)} onShare={() => handleShare(plan)} />
      ) : null}

      {savedPlans.length > 0 ? (
        <>
          <ThemedText variant="subheading" style={styles.sectionTitle}>
            Saved plans
          </ThemedText>
          {savedPlans.map((saved) => (
            <Card key={saved.id} style={styles.savedCard}>
              <View style={styles.savedRow}>
                <View style={styles.savedInfo}>
                  <ThemedText variant="bodyMedium">
                    {saved.plan.days.length}-day plan from {saved.plan.input.base}
                  </ThemedText>
                  <ThemedText variant="caption">
                    Saved {new Date(saved.createdAt).toLocaleDateString('en-IN')}
                    {saved.startDate
                      ? ` · starts ${new Date(saved.startDate).toLocaleDateString('en-IN')}`
                      : ''}
                    {saved.notificationIds.length > 0 ? ' · reminders set' : ''}
                  </ThemedText>
                </View>
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color={colors.danger}
                  onPress={() => removePlan(saved.id)}
                  accessibilityRole="button"
                  accessibilityLabel="Delete this saved plan"
                  hitSlop={12}
                />
              </View>
            </Card>
          ))}
        </>
      ) : null}
    </Screen>
  );
}

function ItineraryView({
  plan,
  onSave,
  onShare,
}: {
  plan: TripPlan;
  onSave: (startInDays: number | null) => Promise<void>;
  onShare: () => void;
}) {
  const [remindMe, setRemindMe] = useState(true);
  const [startInDays, setStartInDays] = useState(1);
  const [saving, setSaving] = useState(false);

  async function handleSavePress() {
    setSaving(true);
    try {
      await onSave(remindMe ? startInDays : null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.itinerary}>
      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Your itinerary
      </ThemedText>

      {plan.days.map((dayPlan) => (
        <Card key={dayPlan.day} style={styles.dayCard}>
          <ThemedText variant="bodyMedium" style={styles.dayTitle}>
            Day {dayPlan.day}
          </ThemedText>
          {dayPlan.stops.length === 0 ? (
            <ThemedText variant="caption">
              No more matching attractions left in this starter directory for your interests —
              try adding another interest or shortening the trip.
            </ThemedText>
          ) : (
            dayPlan.stops.map((stop) => (
              <View key={stop.attraction.id} style={styles.stopRow}>
                <ThemedText variant="caption" style={styles.stopTime}>
                  {stop.arriveTime}
                </ThemedText>
                <View style={styles.stopContent}>
                  <ThemedText variant="body">{stop.attraction.name}</ThemedText>
                  <ThemedText variant="caption">
                    {stop.attraction.priceAdult} · until {stop.departTime}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
          {dayPlan.lunchNote ? (
            <ThemedText variant="caption" style={styles.note}>
              🍽 {dayPlan.lunchNote}
            </ThemedText>
          ) : null}
          {dayPlan.shoppingNote ? (
            <ThemedText variant="caption" style={styles.note}>
              🛍 {dayPlan.shoppingNote}
            </ThemedText>
          ) : null}
        </Card>
      ))}

      <Card style={styles.dayCard}>
        <ThemedText variant="caption">{plan.estimatedCostNote}</ThemedText>
        {plan.unusedInterestNote ? (
          <ThemedText variant="caption" style={styles.note}>
            {plan.unusedInterestNote}
          </ThemedText>
        ) : null}
      </Card>

      <Card style={styles.dayCard}>
        <View style={styles.reminderRow}>
          <ThemedText variant="caption" style={styles.reminderLabel}>
            Remind me when it's time to go
          </ThemedText>
          <Switch
            value={remindMe}
            onValueChange={setRemindMe}
            accessibilityLabel="Remind me when it's time to go"
          />
        </View>
        {remindMe ? (
          <View style={styles.reminderStepperRow}>
            <ThemedText variant="caption">Trip starts in</ThemedText>
            <Stepper
              value={startInDays}
              min={0}
              max={60}
              onChange={setStartInDays}
              suffix="days"
              label="Trip starts in"
            />
          </View>
        ) : null}
      </Card>

      <View style={styles.actionRow}>
        <Button
          label={saving ? 'Saving…' : 'Save plan'}
          onPress={handleSavePress}
          disabled={saving}
          variant="outline"
          style={styles.actionButton}
        />
        <Button label="Share" onPress={onShare} variant="outline" style={styles.actionButton} />
      </View>

      <Button
        label="Book a cab or guide for this plan"
        onPress={() => Linking.openURL('https://tourism.ootymade.com')}
        style={styles.bookButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  stepperWrap: {
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  generateButton: {
    marginTop: spacing.lg,
  },
  itinerary: {
    marginTop: spacing.sm,
  },
  dayCard: {
    marginBottom: spacing.md,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderLabel: {
    flex: 1,
    marginRight: spacing.sm,
  },
  reminderStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  dayTitle: {
    marginBottom: spacing.sm,
  },
  stopRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  stopTime: {
    width: 76,
  },
  stopContent: {
    flex: 1,
  },
  note: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  bookButton: {
    marginBottom: spacing.lg,
  },
  savedCard: {
    marginBottom: spacing.sm,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  savedInfo: {
    flex: 1,
  },
});
