import { StyleSheet, View } from 'react-native';
import { Screen, ThemedText, Card, VerifiedBadge, ExternalLinkButton } from '../components';
import { toyTrainContent } from '../data';
import { colors, spacing } from '../theme';

export function ToyTrainScreen() {
  return (
    <Screen>
      <VerifiedBadge lastVerified={toyTrainContent.lastVerified} sourceNote={toyTrainContent.sourceNote} />

      <Card style={styles.card}>
        <ThemedText variant="body">{toyTrainContent.summary}</ThemedText>
      </Card>

      <ExternalLinkButton label="Book on IRCTC" url={toyTrainContent.irctcUrl} style={styles.linkButton} />

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Stations
      </ThemedText>
      <Card style={styles.card}>
        {toyTrainContent.stations.map((station) => (
          <View key={station.code} style={styles.stationRow}>
            <ThemedText variant="bodyMedium">{station.name}</ThemedText>
            <View style={styles.codeBadge}>
              <ThemedText variant="caption" style={styles.codeText}>
                {station.code}
              </ThemedText>
            </View>
          </View>
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Indicative schedule
      </ThemedText>
      {toyTrainContent.legs.map((leg) => (
        <Card key={`${leg.from}-${leg.to}`} style={styles.card}>
          <ThemedText variant="bodyMedium" style={styles.legTitle}>
            {leg.from} → {leg.to}
          </ThemedText>
          <ThemedText variant="body">Departs {leg.departsApprox} · Arrives {leg.arrivesApprox}</ThemedText>
          <ThemedText variant="caption">{leg.durationApprox}</ThemedText>
        </Card>
      ))}

      <Card style={styles.card}>
        <ThemedText variant="caption">{toyTrainContent.fareNote}</ThemedText>
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Booking tips
      </ThemedText>
      <Card style={styles.card}>
        {toyTrainContent.bookingTips.map((tip) => (
          <View key={tip} style={styles.bulletRow}>
            <ThemedText variant="body" style={styles.bulletDot}>
              •
            </ThemedText>
            <ThemedText variant="body" style={styles.bulletText}>
              {tip}
            </ThemedText>
          </View>
        ))}
      </Card>
    </Screen>
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
  stationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  codeText: {
    color: colors.primary,
    fontWeight: '600' as const,
  },
  legTitle: {
    marginBottom: spacing.xs,
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
});
