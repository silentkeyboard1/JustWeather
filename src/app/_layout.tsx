import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { FavoritesProvider } from '../features/favorites/context/FavoritesContext';

import { useAppTheme } from '../shared/theme/theme';

export default function RootLayout() {
  const {
    colors,
    isDark,
  } = useAppTheme();

  return (
    <FavoritesProvider>
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
    </FavoritesProvider>
  );
}