import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen, ThemedText, Card, VerifiedBadge, ExternalLinkButton } from '../components';
import { shoppingContent } from '../data';
import { colors, radii, spacing } from '../theme';

export function FoodShoppingScreen() {
  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        Food & Shopping
      </ThemedText>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        What to buy in Ooty
      </ThemedText>
      <VerifiedBadge
        lastVerified={shoppingContent.lastVerified}
        sourceNote={shoppingContent.sourceNote}
      />
      <Card style={styles.card}>
        <ThemedText variant="body">{shoppingContent.intro}</ThemedText>
      </Card>

      {shoppingContent.items.map((item) => (
        <Card key={item.name} style={styles.card}>
          <View style={styles.itemHeader}>
            <ThemedText variant="bodyMedium">{item.name}</ThemedText>
            {item.giTagged ? (
              <View style={styles.giBadge}>
                <ThemedText variant="caption" style={styles.giBadgeText}>
                  GI Tagged
                </ThemedText>
              </View>
            ) : null}
          </View>
          <ThemedText variant="body">{item.description}</ThemedText>
        </Card>
      ))}

      <Card style={styles.disclosureCard}>
        <View style={styles.disclosureRow}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <ThemedText variant="caption" style={styles.disclosureText}>
            {shoppingContent.disclosure}
          </ThemedText>
        </View>
      </Card>

      <ExternalLinkButton
        label="Shop genuine Nilgiris products at ootymade.com"
        url={shoppingContent.ootymadeUrl}
        style={styles.linkButton}
      />

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Where to eat
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body">
          We're building a curated list of Ooty and Coonoor eateries from our own local
          knowledge — not scraped reviews. Check back soon, or ask the AI concierge once it's
          live.
        </ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  giBadge: {
    backgroundColor: colors.background,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.accent,
  },
  giBadgeText: {
    color: colors.accentText,
  },
  disclosureCard: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  disclosureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  disclosureText: {
    flex: 1,
  },
  linkButton: {
    marginBottom: spacing.lg,
  },
});
