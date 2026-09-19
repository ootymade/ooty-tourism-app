import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AskStackParamList } from './types';
import { stackScreenOptions } from './screenOptions';
import { AskScreen } from '../screens';

const Stack = createNativeStackNavigator<AskStackParamList>();

export function AskStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Ask" component={AskScreen} options={{ title: 'Ask OotyMade' }} />
    </Stack.Navigator>
  );
}
