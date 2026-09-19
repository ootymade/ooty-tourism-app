import { StyleSheet, View } from 'react-native';
import { Screen, ThemedText, Card, VerifiedBadge, ExternalLinkButton } from '../components';
import { connectivityContent } from '../data';
import { colors, spacing } from '../theme';

export function ConnectivityScreen() {
  const { airport, railStations, busInfo, localTransport, ghatRoadGuide } = connectivityContent;

  return (
    <Screen>
      <VerifiedBadge
        lastVerified={connectivityContent.lastVerified}
        sourceNote={connectivityContent.sourceNote}
      />

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Nearest airport — {airport.name} ({airport.code})
      </ThemedText>
      {airport.routes.map((route) => (
        <Card key={route.label} style={styles.card}>
          <ThemedText variant="bodyMedium">{route.label}</ThemedText>
          <ThemedText variant="body">
            {route.distanceApprox} · {route.durationApprox}
          </ThemedText>
          <ThemedText variant="caption">{route.note}</ThemedText>
        </Card>
      ))}

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Nearest railway stations
      </ThemedText>
      <Card style={styles.card}>
        {railStations.map((station) => (
          <View key={station.name} style={styles.stationBlock}>
            <ThemedText variant="bodyMedium">{station.name}</ThemedText>
            <ThemedText variant="caption">{station.note}</ThemedText>
          </View>
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Bus routes
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body">Operators: {busInfo.operators.join(', ')}</ThemedText>
        <ThemedText variant="body">Major origin cities: {busInfo.majorOriginCities.join(', ')}</ThemedText>
        <ThemedText variant="caption" style={styles.noteSpacing}>
          {busInfo.note}
        </ThemedText>
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Local transport
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body" style={styles.noteSpacing}>
          {localTransport.summary}
        </ThemedText>
        {localTransport.points.map((point) => (
          <View key={point} style={styles.bulletRow}>
            <ThemedText variant="body" style={styles.bulletDot}>
              •
            </ThemedText>
            <ThemedText variant="body" style={styles.bulletText}>
              {point}
            </ThemedText>
          </View>
        ))}
      </Card>

      <ThemedText variant="subheading" style={styles.sectionTitle}>
        Ghat road guide
      </ThemedText>
      <Card style={styles.card}>
        <ThemedText variant="body" style={styles.noteSpacing}>
          {ghatRoadGuide.summary}
        </ThemedText>
        {ghatRoadGuide.tips.map((tip) => (
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

      <ExternalLinkButton
        label="Check road & district status"
        url={ghatRoadGuide.roadConditionUrl}
        style={styles.linkButton}
      />
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
  stationBlock: {
    marginBottom: spacing.sm,
  },
  noteSpacing: {
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
});
