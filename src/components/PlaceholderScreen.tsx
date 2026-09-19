import { Screen } from './Screen';
import { ThemedText } from './ThemedText';
import { Card } from './Card';
import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

interface PlaceholderScreenProps {
  title: string;
  description: string;
}

export function PlaceholderScreen({ title, description }: PlaceholderScreenProps) {
  return (
    <Screen>
      <ThemedText variant="display" style={styles.title}>
        {title}
      </ThemedText>
      <Card>
        <ThemedText variant="body">{description}</ThemedText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
});
