import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';

import { fontsToLoad, colors } from './src/theme';
import { queryClient } from './src/lib/queryClient';
import { RootNavigator } from './src/navigation';
import { initSentry, Sentry } from './src/lib/sentry';
import { initAnalytics } from './src/lib/analytics';

SplashScreen.preventAutoHideAsync().catch(() => {});
initSentry();
initAnalytics();

function App() {
  const [fontsLoaded, fontError] = useFonts(fontsToLoad);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      setAppReady(true);
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <RootNavigator />
            <StatusBar style="light" />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
