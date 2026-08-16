import { Tabs } from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import {
  CloudSun,
  Star,
} from 'lucide-react-native';

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
        <Tabs
          screenOptions={{
            headerShown: false,

            tabBarActiveTintColor:
              colors.primary,

            tabBarInactiveTintColor:
              colors.tabInactive,

            tabBarStyle: {
              backgroundColor:
                colors.surface,

              borderTopColor:
                colors.border,
            },

            tabBarLabelStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Wetter',

              tabBarIcon: ({
                color,
                size,
              }) => (
                <CloudSun
                  color={color}
                  size={size}
                />
              ),
            }}
          />

          <Tabs.Screen
            name="favorites"
            options={{
              title: 'Favoriten',

              tabBarIcon: ({
                color,
                size,
                focused,
              }) => (
                <Star
                  color={color}
                  size={size}
                  fill={
                    focused
                      ? color
                      : 'transparent'
                  }
                />
              ),
            }}
          />
        </Tabs>

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