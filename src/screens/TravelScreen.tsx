import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, ThemedText, NavCard } from '../components';
import { TravelStackParamList } from '../navigation/types';
import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

type Props = NativeStackScreenProps<TravelStackParamList, 'Travel'>;

export function TravelScreen({ navigation }: Props) {
  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        Travel
      </ThemedText>
      <ThemedText variant="body" style={styles.subtitle}>
        Everything for getting into, around and out of the Nilgiris.
      </ThemedText>

      <NavCard
        icon="document-text-outline"
        title="E-Pass"
        subtitle="Who needs it, how to apply, and the official portal"
        onPress={() => navigation.navigate('EPass')}
      />
      <NavCard
        icon="train-outline"
        title="Toy Train"
        subtitle="Nilgiri Mountain Railway timings, stations and booking tips"
        onPress={() => navigation.navigate('ToyTrain')}
      />
      <NavCard
        icon="car-outline"
        title="Getting Here & Around"
        subtitle="Airport, rail, buses, local taxis and the ghat roads"
        onPress={() => navigation.navigate('Connectivity')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.lg,
  },
});
