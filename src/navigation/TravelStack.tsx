import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TravelStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { TravelScreen, EPassScreen, ToyTrainScreen, ConnectivityScreen } from '../screens';

const Stack = createNativeStackNavigator<TravelStackParamList>();

export function TravelStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Travel" component={TravelScreen} options={{ title: 'Travel' }} />
      <Stack.Screen name="EPass" component={EPassScreen} options={{ title: 'E-Pass' }} />
      <Stack.Screen name="ToyTrain" component={ToyTrainScreen} options={{ title: 'Toy Train' }} />
      <Stack.Screen
        name="Connectivity"
        component={ConnectivityScreen}
        options={{ title: 'Getting Here & Around' }}
      />
    </Stack.Navigator>
  );
}
