import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';
import { colors, radii, spacing } from '../theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
    >
      <ThemedText
        variant="caption"
        style={selected ? styles.labelSelected : styles.labelUnselected}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    borderRadius: radii.pill,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  labelSelected: {
    color: colors.textOnPrimary,
  },
  labelUnselected: {
    color: colors.text,
  },
});
