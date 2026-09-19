import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedText } from './ThemedText';
import { colors, radii, spacing } from '../theme';

interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}

export function Stepper({ value, min, max, onChange, suffix }: StepperProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(Math.max(min, value - 1))}
        style={styles.button}
        disabled={value <= min}
      >
        <Ionicons name="remove" size={18} color={value <= min ? colors.textMuted : colors.primary} />
      </Pressable>
      <ThemedText variant="bodyMedium" style={styles.value}>
        {value}
        {suffix ? ` ${suffix}` : ''}
      </ThemedText>
      <Pressable
        onPress={() => onChange(Math.min(max, value + 1))}
        style={styles.button}
        disabled={value >= max}
      >
        <Ionicons name="add" size={18} color={value >= max ? colors.textMuted : colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 56,
    textAlign: 'center',
  },
});
