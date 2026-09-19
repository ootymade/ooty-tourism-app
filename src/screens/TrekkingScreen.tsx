import { useState } from 'react';
import { Linking, StyleSheet, Switch, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen, ThemedText, Card, VerifiedBadge, ExternalLinkButton } from '../components';
import { TrekRoute, getPublishedTreks, treksContent } from '../data';
import { colors, spacing } from '../theme';

export function TrekkingScreen() {
  const [showUnverifiedPreview, setShowUnverifiedPreview] = useState(false);
  const publishedRoutes = getPublishedTreks();
  const unverifiedRoutes = treksContent.routes.filter((r) => !publishedRoutes.includes(r));

  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        Trekking
      </ThemedText>

      <VerifiedBadge lastVerified={treksContent.lastVerified} sourceNote={treksContent.sourceNote} />

      {publishedRoutes.length === 0 ? (
        <Card style={styles.card}>
          <ThemedText variant="bodyMedium" style={styles.emptyTitle}>
            No verified routes published yet
          </ThemedText>
          <ThemedText variant="body" style={styles.emptyBody}>
            Trekking safety information is too important to guess at. A route only appears here
            once someone from the OotyMade team has walked it recently and confirmed the
            difficulty, permit requirements and safety essentials in person.
          </ThemedText>
        </Card>
      ) : (
        publishedRoutes.map((route) => <TrekCard key={route.id} route={route} />)
      )}

      <ExternalLinkButton
        label="Ask OotyMade about guided treks"
        url="https://tourism.ootymade.com"
        style={styles.linkButton}
      />

      {__DEV__ ? (
        <Card style={styles.devCard}>
          <View style={styles.devRow}>
            <Ionicons name="construct-outline" size={16} color={colors.textMuted} />
            <ThemedText variant="caption" style={styles.devLabel}>
              Dev only — preview unverified routes ({unverifiedRoutes.length})
            </ThemedText>
            <Switch value={showUnverifiedPreview} onValueChange={setShowUnverifiedPreview} />
          </View>
          {showUnverifiedPreview
            ? unverifiedRoutes.map((route) => (
                <View key={route.id} style={styles.previewRoute}>
                  <ThemedText variant="caption" style={styles.previewBadge}>
                    UNVERIFIED — NOT PUBLISHED
                  </ThemedText>
                  <ThemedText variant="bodyMedium">{route.name}</ThemedText>
                  <ThemedText variant="caption">
                    {route.region} · {route.distanceKm} km · ~{route.durationHours}h ·{' '}
                    {route.difficulty}
                  </ThemedText>
                </View>
              ))
            : null}
        </Card>
      ) : null}
    </Screen>
  );
}

function TrekCard({ route }: { route: TrekRoute }) {
  return (
    <Card style={styles.card}>
      <ThemedText variant="bodyMedium">{route.name}</ThemedText>
      <ThemedText variant="caption">
        {route.region} · {route.distanceKm} km · ~{route.durationHours}h · {route.difficulty}
      </ThemedText>
      <ThemedText variant="caption" style={styles.verifiedLine}>
        Verified by {route.verifiedBy} on{' '}
        {route.verifiedDate ? new Date(route.verifiedDate).toLocaleDateString('en-IN') : ''}
      </ThemedText>
      <ThemedText variant="body" style={styles.permitNote}>
        {route.permitNote}
      </ThemedText>
      {route.safetyEssentials.length > 0 ? (
        <View style={styles.safetyList}>
          {route.safetyEssentials.map((item) => (
            <ThemedText key={item} variant="body" style={styles.safetyItem}>
              • {item}
            </ThemedText>
          ))}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.xs,
  },
  card: {
    marginBottom: spacing.md,
  },
  emptyTitle: {
    marginBottom: spacing.xs,
  },
  emptyBody: {
    color: colors.textMuted,
  },
  verifiedLine: {
    color: colors.success,
    marginTop: spacing.xs,
  },
  permitNote: {
    marginTop: spacing.sm,
  },
  safetyList: {
    marginTop: spacing.sm,
  },
  safetyItem: {
    marginBottom: 2,
  },
  linkButton: {
    marginBottom: spacing.lg,
  },
  devCard: {
    backgroundColor: colors.background,
    borderStyle: 'dashed',
    marginBottom: spacing.xl,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  devLabel: {
    flex: 1,
  },
  previewRoute: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  previewBadge: {
    color: colors.danger,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
});
