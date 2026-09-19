import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootTabParamList } from './types';
import { colors, fontFamilies, fontSizes } from '../theme';
import { HomeStack } from './HomeStack';
import { ExploreStack } from './ExploreStack';
import { PlanStack } from './PlanStack';
import { TravelStack } from './TravelStack';
import { AskStack } from './AskStack';

const Tab = createBottomTabNavigator<RootTabParamList>();

const icons: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  ExploreTab: 'compass',
  PlanTab: 'map',
  TravelTab: 'car',
  AskTab: 'chatbubble-ellipses',
};

export function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fontFamilies.bodyMedium, fontSize: fontSizes.xs },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name as keyof RootTabParamList]} color={color} size={size} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="ExploreTab" component={ExploreStack} options={{ title: 'Explore' }} />
      <Tab.Screen name="PlanTab" component={PlanStack} options={{ title: 'Plan' }} />
      <Tab.Screen name="TravelTab" component={TravelStack} options={{ title: 'Travel' }} />
      <Tab.Screen name="AskTab" component={AskStack} options={{ title: 'Ask' }} />
    </Tab.Navigator>
  );
}
