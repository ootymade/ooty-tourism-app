import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, ThemedText, Card, VerifiedBadge } from '../components';
import { ExploreStackParamList } from '../navigation/types';
import { useAttraction } from '../hooks/useAttractions';
import { isOpenNow, formatOpeningHours, formatDuration } from '../lib/attractionUtils';
import { attractionsContent } from '../data';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<ExploreStackParamList, 'AttractionDetail'>;

export function AttractionDetailScreen({ route }: Props) {
  const { data: attraction, isLoading } = useAttraction(route.params.id);

  if (isLoading || !attraction) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  const open = isOpenNow(attraction);

  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        {attraction.name}
      </ThemedText>
      <ThemedText variant="caption" style={styles.subtitle}>
        {attraction.region} · {attraction.distanceFromOotyKm} km from Ooty town
      </ThemedText>

      <VerifiedBadge
        lastVerified={attractionsContent.lastVerified}
        sourceNote={attractionsContent.sourceNote}
      />

      <Card style={styles.card}>
        <Row icon="time-outline" label="Hours" value={formatOpeningHours(attraction.openingHours)} />
        <Row
          icon={open ? 'checkmark-circle-outline' : 'close-circle-outline'}
          label="Right now"
          value={open ? 'Open' : 'Closed'}
          valueColor={open ? colors.success : colors.danger}
        />
        <Row icon="pricetag-outline" label="Adult entry" value={attraction.priceAdult} />
        <Row icon="pricetag-outline" label="Child entry" value={attraction.priceChild} />
        <Row icon="hourglass-outline" label="Time needed" value={formatDuration(attraction.visitDurationMinutes)} />
        <Row icon="sunny-outline" label="Best time" value={attraction.bestTimeOfDay} />
      </Card>

      {attraction.priceNote ? (
        <Card style={styles.card}>
          <ThemedText variant="caption">{attraction.priceNote}</ThemedText>
        </Card>
      ) : null}

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Why locals rate it
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body">{attraction.whyLocalsRateIt}</ThemedText>
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Getting around once there
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body">{attraction.accessibilityNote}</ThemedText>
      </Card>

      <Card style={[styles.card, styles.mapLinkCard]}>
        <ThemedText
          variant="bodyMedium"
          style={styles.mapLink}
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${attraction.latitude},${attraction.longitude}`
            )
          }
        >
          Open in Google Maps →
        </ThemedText>
      </Card>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.rowIcon} />
      <ThemedText variant="caption" style={styles.rowLabel}>
        {label}
      </ThemedText>
      <ThemedText variant="bodyMedium" style={[styles.rowValue, valueColor ? { color: valueColor } : null]}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  rowIcon: {
    marginRight: spacing.sm,
  },
  rowLabel: {
    flex: 1,
  },
  rowValue: {
    flexShrink: 1,
    textAlign: 'right',
  },
  mapLinkCard: {
    alignItems: 'center',
  },
  mapLink: {
    color: colors.primary,
  },
});
