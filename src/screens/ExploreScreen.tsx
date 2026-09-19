import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Switch, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen, ThemedText, FilterChip, AttractionCard } from '../components';
import { ExploreStackParamList } from '../navigation/types';
import { Attraction, AttractionCategory, attractionsContent } from '../data';
import { useAttractions } from '../hooks/useAttractions';
import { isOpenNow, sortAttractions, SortKey } from '../lib/attractionUtils';
import { colors, radii, spacing } from '../theme';

type Props = NativeStackScreenProps<ExploreStackParamList, 'Explore'>;

const CATEGORY_LABELS: Record<AttractionCategory, string> = {
  garden: 'Gardens',
  lake: 'Lakes',
  viewpoint: 'Viewpoints',
  heritage: 'Heritage',
  museum: 'Museums',
  wildlife: 'Wildlife',
  waterfall: 'Waterfalls',
};

const SORT_LABELS: Record<SortKey, string> = {
  distance: 'Nearest',
  duration: 'Quickest',
  name: 'A–Z',
};

const OOTY_REGION = {
  latitude: 11.42,
  longitude: 76.72,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

export function ExploreScreen({ navigation }: Props) {
  const { data: attractions, isLoading } = useAttractions();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [category, setCategory] = useState<AttractionCategory | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('distance');
  const [openNowOnly, setOpenNowOnly] = useState(false);

  const categories = useMemo(() => {
    const set = new Set<AttractionCategory>();
    (attractions ?? []).forEach((a) => set.add(a.category));
    return Array.from(set);
  }, [attractions]);

  const filtered = useMemo(() => {
    let list = attractions ?? [];
    if (category !== 'all') list = list.filter((a) => a.category === category);
    if (openNowOnly) list = list.filter((a) => isOpenNow(a));
    return sortAttractions(list, sortKey);
  }, [attractions, category, sortKey, openNowOnly]);

  function goToDetail(attraction: Attraction) {
    navigation.navigate('AttractionDetail', { id: attraction.id });
  }

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <ThemedText variant="display" style={styles.title}>
          Explore
        </ThemedText>
        <View style={styles.viewToggle}>
          <ToggleButton
            icon="list"
            label="List view"
            active={viewMode === 'list'}
            onPress={() => setViewMode('list')}
          />
          <ToggleButton
            icon="map"
            label="Map view"
            active={viewMode === 'map'}
            onPress={() => setViewMode('map')}
          />
        </View>
      </View>

      <View style={styles.filterRow}>
        <FilterChip label="All" selected={category === 'all'} onPress={() => setCategory('all')} />
        {categories.map((c) => (
          <FilterChip
            key={c}
            label={CATEGORY_LABELS[c]}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>

      <View style={styles.controlsRow}>
        <View style={styles.sortRow}>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <FilterChip
              key={key}
              label={SORT_LABELS[key]}
              selected={sortKey === key}
              onPress={() => setSortKey(key)}
            />
          ))}
        </View>
        <View style={styles.openNowRow}>
          <ThemedText variant="caption">Open now</ThemedText>
          <Switch
            value={openNowOnly}
            onValueChange={setOpenNowOnly}
            trackColor={{ false: colors.border, true: colors.primary }}
            accessibilityLabel="Show only attractions open now"
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loading} color={colors.primary} />
      ) : viewMode === 'list' ? (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <AttractionCard attraction={item} onPress={() => goToDetail(item)} />}
          ListEmptyComponent={
            <ThemedText variant="body" style={styles.emptyText}>
              Nothing matches these filters right now — try clearing "Open now" or picking a
              different category.
            </ThemedText>
          }
        />
      ) : (
        <MapView style={styles.map} initialRegion={OOTY_REGION}>
          {filtered.map((attraction) => (
            <Marker
              key={attraction.id}
              coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
              title={attraction.name}
              description={`${attraction.region} · ${attraction.distanceFromOotyKm} km from Ooty`}
              onCalloutPress={() => goToDetail(attraction)}
            />
          ))}
        </MapView>
      )}

      <ThemedText variant="caption" style={styles.footerNote}>
        {attractionsContent.attractions.length} attractions in this starter set · last verified{' '}
        {attractionsContent.lastVerified}
      </ThemedText>
    </Screen>
  );
}

function ToggleButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      style={[styles.toggleButton, { backgroundColor: active ? colors.primary : colors.surface }]}
    >
      <Ionicons name={icon} size={18} color={active ? colors.textOnPrimary : colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  title: {
    marginBottom: 0,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
  },
  controlsRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  openNowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  loading: {
    marginTop: spacing.xl,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  map: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  footerNote: {
    textAlign: 'center',
    paddingVertical: spacing.sm,
  },
});
