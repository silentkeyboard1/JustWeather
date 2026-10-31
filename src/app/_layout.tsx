import {
  Stack,
} from 'expo-router';

import {
  StatusBar,
} from 'expo-status-bar';

import {
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import {
  FavoritesProvider,
} from '../features/favorites/context/FavoritesContext';

import {
  WidgetCityProvider,
} from '../features/weather-widget/context/WidgetCityContext';

import {
  AppThemeProvider,
  useAppTheme,
} from '../shared/theme/theme';

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
      }}
    >
      <AppThemeProvider>
        <FavoritesProvider>
          <WidgetCityProvider>
            <AppNavigation />
          </WidgetCityProvider>
        </FavoritesProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigation() {
  const {
    isDark,
  } = useAppTheme();

  return (
    <>
      <StatusBar
        style={
          isDark
            ? 'light'
            : 'dark'
        }
      />

      <Stack
        screenOptions={{
          headerShown:
            false,
        }}
      />
    </>
  );
}