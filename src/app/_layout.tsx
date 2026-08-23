import {
  Stack,
} from 'expo-router';

import {
  StatusBar,
} from 'expo-status-bar';

import {
  FavoritesProvider,
} from '../features/favorites/context/FavoritesContext';

import {
  WidgetCityProvider,
} from '../features/weather-widget/context/WidgetCityContext';

import {
  useAppTheme,
} from '../shared/theme/theme';

export default function RootLayout() {
  const {
    colors,
    isDark,
  } = useAppTheme();

  return (
    <FavoritesProvider>
      <WidgetCityProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,

              contentStyle: {
                backgroundColor:
                  colors.background,
              },
            }}
          >
            <Stack.Screen
              name="index"
            />

            <Stack.Screen
              name="search"
              options={{
                animation:
                  'slide_from_bottom',
              }}
            />
          </Stack>

          <StatusBar
            style={
              isDark
                ? 'light'
                : 'dark'
            }
          />
        </>
      </WidgetCityProvider>
    </FavoritesProvider>
  );
}