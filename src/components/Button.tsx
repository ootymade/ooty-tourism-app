import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { colors, fontFamilies, fontSizes, radii, spacing } from '../theme';
import { ThemedText } from './ThemedText';

type Variant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
}

export function Button({ label, onPress, variant = 'primary', style, disabled }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <ThemedText
        variant="bodyMedium"
        style={[styles.label, variant === 'outline' ? { color: colors.primary } : { color: labelColor(variant) }]}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function labelColor(variant: Variant) {
  if (variant === 'primary') return colors.textOnPrimary;
  if (variant === 'secondary') return colors.textOnAccent;
  return colors.primary;
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: fontSizes.md,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.accent },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
};
