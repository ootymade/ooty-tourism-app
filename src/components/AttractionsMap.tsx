import { StyleSheet, View } from 'react-native';
import { Attraction } from '../data';
import { ThemedText } from './ThemedText';
import { colors, radii, spacing } from '../theme';

interface AttractionsMapProps {
  attractions: Attraction[];
  onPressAttraction: (attraction: Attraction) => void;
}

// react-native-maps has no web renderer. Metro/Expo picks this file for web
// builds and AttractionsMap.native.tsx for iOS/Android automatically, so
// the app degrades gracefully on web instead of crashing at import time.
export function AttractionsMap({ attractions }: AttractionsMapProps) {
  return (
    <View style={styles.placeholder}>
      <ThemedText variant="bodyMedium" style={styles.text}>
        Map view isn't available on web yet — {attractions.length} attractions are still
        browsable in the list view.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  text: {
    textAlign: 'center',
    color: colors.textMuted,
  },
});
