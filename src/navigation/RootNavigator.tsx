import { useRef } from 'react';
import { NavigationContainer, DefaultTheme, useNavigationContainerRef } from '@react-navigation/native';
import { colors } from '../theme';
import { trackScreen } from '../lib/analytics';
import { BottomTabs } from './BottomTabs';

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
  },
};

function getCurrentRouteName(ref: ReturnType<typeof useNavigationContainerRef>): string | undefined {
  // useNavigationContainerRef() only resolves getCurrentRoute()'s route-name
  // union when ReactNavigation.RootParamList is globally augmented, which
  // this app doesn't do — the cast just recovers the (always-present at
  // runtime) name field for analytics purposes.
  return (ref.getCurrentRoute() as { name: string } | undefined)?.name;
}

export function RootNavigator() {
  const navigationRef = useNavigationContainerRef();
  const currentRouteName = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navigationTheme}
      onReady={() => {
        currentRouteName.current = getCurrentRouteName(navigationRef);
      }}
      onStateChange={() => {
        const previousRouteName = currentRouteName.current;
        const nextRouteName = getCurrentRouteName(navigationRef);
        if (nextRouteName && nextRouteName !== previousRouteName) {
          trackScreen(nextRouteName);
        }
        currentRouteName.current = nextRouteName;
      }}
    >
      <BottomTabs />
    </NavigationContainer>
  );
}
