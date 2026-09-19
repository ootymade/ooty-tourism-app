import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { HomeScreen, FoodShoppingScreen, EmergencyScreen, SettingsScreen } from '../screens';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'OotyMade' }} />
      <Stack.Screen name="FoodShopping" component={FoodShoppingScreen} options={{ title: 'Food & Shopping' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency & Utilities' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}
