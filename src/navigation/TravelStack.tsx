import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TravelStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { TravelScreen } from '../screens';

const Stack = createNativeStackNavigator<TravelStackParamList>();

export function TravelStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Travel" component={TravelScreen} options={{ title: 'Travel' }} />
    </Stack.Navigator>
  );
}
