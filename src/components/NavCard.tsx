import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { colors, radii, spacing } from '../theme';

interface NavCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function NavCard({ icon, title, subtitle, onPress }: NavCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={26} color={colors.primary} />
      </View>
      <ThemedText variant="subheading" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText variant="caption">{subtitle}</ThemedText>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} style={styles.chevron} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginBottom: spacing.xs,
  },
  title: {
    marginBottom: 2,
  },
  chevron: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
  },
});
