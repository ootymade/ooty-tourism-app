import { Linking, Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen, ThemedText, Card, VerifiedBadge } from '../components';
import { emergencyContent } from '../data';
import { colors, radii, spacing } from '../theme';

export function EmergencyScreen() {
  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        Emergency
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        These numbers work with no signal bars to spare and no data connection — save this screen's
        numbers to your phone before you head out of town.
      </ThemedText>

      <VerifiedBadge
        lastVerified={emergencyContent.lastVerified}
        sourceNote={emergencyContent.sourceNote}
      />

      {emergencyContent.contacts.map((contact) => (
        <Pressable
          key={contact.number}
          onPress={() => Linking.openURL(`tel:${contact.number}`)}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.numberBadge}>
                <ThemedText variant="subheading" style={styles.numberText}>
                  {contact.number}
                </ThemedText>
              </View>
              <View style={styles.textBlock}>
                <ThemedText variant="bodyMedium">{contact.label}</ThemedText>
                <ThemedText variant="caption">{contact.description}</ThemedText>
              </View>
              <Ionicons name="call" size={20} color={colors.primary} />
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginRight: spacing.md,
    minWidth: 64,
    alignItems: 'center',
  },
  numberText: {
    color: colors.primary,
  },
  textBlock: {
    flex: 1,
  },
});
