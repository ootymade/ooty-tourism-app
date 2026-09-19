import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { PlanScreen } from '../screens';

const Stack = createNativeStackNavigator<PlanStackParamList>();

export function PlanStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Plan" component={PlanScreen} options={{ title: 'Plan Your Trip' }} />
    </Stack.Navigator>
  );
}
