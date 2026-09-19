import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { colors, radii, spacing } from '../theme';

interface VerifiedBadgeProps {
  lastVerified: string;
  sourceNote?: string;
}

export function VerifiedBadge({ lastVerified, sourceNote }: VerifiedBadgeProps) {
  const formatted = formatDate(lastVerified);
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Ionicons name="checkmark-circle" size={14} color={colors.success} />
        <ThemedText variant="caption" style={styles.badgeText}>
          Last verified {formatted}
        </ThemedText>
      </View>
      {sourceNote ? (
        <ThemedText variant="caption" style={styles.note}>
          {sourceNote}
        </ThemedText>
      ) : null}
    </View>
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    gap: 6,
  },
  badgeText: {
    color: colors.textMuted,
  },
  note: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
});
