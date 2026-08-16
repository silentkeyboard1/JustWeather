import { Tabs } from 'expo-router';

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
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favoriten',
          }}
        />
      </Tabs>
    </FavoritesProvider>
  );
}