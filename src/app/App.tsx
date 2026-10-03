import { useEffect, useMemo } from 'react';
import { StatusBar } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import type { Theme as NavigationTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useSettings } from '@features/settings';
import { ThemeProvider, useTheme } from '@shared/theme';
import { configureBackgroundSync } from './background/backgroundSync';
import { useDataSync } from './background/useDataSync';
import { linking } from './navigation/linking';
import { RootNavigator } from './navigation/RootNavigator';

function ThemedNavigation() {
  const theme = useTheme();
  const navigationTheme = useMemo<NavigationTheme>(() => {
    const base = theme.dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.text,
        border: theme.colors.border,
      },
    };
  }, [theme]);

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export function App() {
  const { themeMode } = useSettings();
  useDataSync();
  useEffect(() => {
    configureBackgroundSync().catch(error =>
      console.warn('[sync] Không cấu hình được chạy nền', error),
    );
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider mode={themeMode}>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
