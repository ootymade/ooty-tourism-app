import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExploreStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { ExploreScreen, AttractionDetailScreen } from '../screens';

const Stack = createNativeStackNavigator<ExploreStackParamList>();

export function ExploreStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AttractionDetail"
        component={AttractionDetailScreen}
        options={{ title: 'Details' }}
      />
    </Stack.Navigator>
  );
}
