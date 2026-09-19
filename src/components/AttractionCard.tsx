import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { Attraction, AttractionCategory } from '../data';
import { isOpenNow, formatDuration } from '../lib/attractionUtils';
import { colors, radii, spacing } from '../theme';

const categoryIcons: Record<AttractionCategory, keyof typeof Ionicons.glyphMap> = {
  garden: 'flower-outline',
  lake: 'water-outline',
  viewpoint: 'telescope-outline',
  heritage: 'business-outline',
  museum: 'albums-outline',
  wildlife: 'paw-outline',
  waterfall: 'rainy-outline',
};

interface AttractionCardProps {
  attraction: Attraction;
  onPress: () => void;
}

export function AttractionCard({ attraction, onPress }: AttractionCardProps) {
  const open = isOpenNow(attraction);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${attraction.name}, ${attraction.region}, ${attraction.distanceFromOotyKm} kilometres away, ${attraction.priceAdult}, ${open ? 'open now' : 'closed now'}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={categoryIcons[attraction.category]} size={22} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <ThemedText variant="bodyMedium" style={styles.name} numberOfLines={1}>
            {attraction.name}
          </ThemedText>
          <View style={[styles.statusDot, { backgroundColor: open ? colors.success : colors.textMuted }]} />
        </View>
        <ThemedText variant="caption">
          {attraction.region} · {attraction.distanceFromOotyKm} km · {formatDuration(attraction.visitDurationMinutes)}
        </ThemedText>
        <ThemedText variant="caption" style={styles.price}>
          {attraction.priceAdult}
        </ThemedText>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    marginRight: spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  price: {
    marginTop: 2,
    color: colors.accentText,
  },
});
