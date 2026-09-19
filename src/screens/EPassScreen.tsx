import { StyleSheet, View } from 'react-native';
import { Screen, ThemedText, Card, VerifiedBadge, ExternalLinkButton } from '../components';
import { ePassContent } from '../data';
import { colors, spacing } from '../theme';

export function EPassScreen() {
  return (
    <Screen>
      <VerifiedBadge lastVerified={ePassContent.lastVerified} sourceNote={ePassContent.sourceNote} />

      <Card style={styles.card}>
        <ThemedText variant="body">{ePassContent.summary}</ThemedText>
      </Card>

      <ExternalLinkButton
        label="Apply on the official portal"
        url={ePassContent.officialPortalUrl}
        style={styles.linkButton}
      />

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Who needs it
      </ThemedText>
      <Card style={styles.card}>
        {ePassContent.whoNeedsIt.map((item) => (
          <Bullet key={item} text={item} />
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Who's exempt
      </ThemedText>
      <Card style={styles.card}>
        {ePassContent.whoIsExempt.map((item) => (
          <Bullet key={item} text={item} />
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        How to apply
      </ThemedText>
      <Card style={styles.card}>
        {ePassContent.steps.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <ThemedText variant="caption" style={styles.stepNumberText}>
                {index + 1}
              </ThemedText>
            </View>
            <ThemedText variant="body" style={styles.stepText}>
              {step}
            </ThemedText>
          </View>
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        FAQs
      </ThemedText>
      {ePassContent.faqs.map((faq) => (
        <Card key={faq.question} style={styles.card}>
          <ThemedText variant="bodyMedium" style={styles.faqQuestion}>
            {faq.question}
          </ThemedText>
          <ThemedText variant="body">{faq.answer}</ThemedText>
        </Card>
      ))}
    </Screen>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <ThemedText variant="body" style={styles.bulletDot}>
        •
      </ThemedText>
      <ThemedText variant="body" style={styles.bulletText}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  linkButton: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  bulletDot: {
    color: colors.accent,
    marginRight: spacing.xs,
  },
  bulletText: {
    flex: 1,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    color: colors.textOnPrimary,
  },
  stepText: {
    flex: 1,
  },
  faqQuestion: {
    marginBottom: spacing.xs,
  },
});
