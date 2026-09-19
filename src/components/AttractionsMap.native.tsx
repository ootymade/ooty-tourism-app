import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Attraction } from '../data';
import { radii, spacing } from '../theme';

const OOTY_REGION = {
  latitude: 11.42,
  longitude: 76.72,
  latitudeDelta: 0.45,
  longitudeDelta: 0.45,
};

interface AttractionsMapProps {
  attractions: Attraction[];
  onPressAttraction: (attraction: Attraction) => void;
}

export function AttractionsMap({ attractions, onPressAttraction }: AttractionsMapProps) {
  return (
    <MapView style={styles.map} initialRegion={OOTY_REGION}>
      {attractions.map((attraction) => (
        <Marker
          key={attraction.id}
          coordinate={{ latitude: attraction.latitude, longitude: attraction.longitude }}
          title={attraction.name}
          description={`${attraction.region} · ${attraction.distanceFromOotyKm} km from Ooty`}
          onCalloutPress={() => onPressAttraction(attraction)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    marginHorizontal: spacing.md,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
});
