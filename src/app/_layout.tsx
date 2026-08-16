import { Tabs } from 'expo-router';

import {
  CloudSun,
  Star,
} from 'lucide-react-native';

import { FavoritesProvider } from '../features/favorites/context/FavoritesContext';

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
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
            }) => (
              <Star
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </FavoritesProvider>
  );
}