import { Linking, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { colors, fontFamilies, fontSizes, radii, spacing } from '../theme';

interface ExternalLinkButtonProps {
  label: string;
  url: string;
  style?: ViewStyle;
}

export function ExternalLinkButton({ label, url, style }: ExternalLinkButtonProps) {
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      accessibilityLabel={label}
      accessibilityHint="Opens in your browser"
      style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
    >
      <ThemedText variant="bodyMedium" style={styles.label}>
        {label}
      </ThemedText>
      <Ionicons name="open-outline" size={16} color={colors.textOnPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  label: {
    color: colors.textOnPrimary,
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
  },
});
