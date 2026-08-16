import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFavorites } from '../features/favorites/context/FavoritesContext';

export default function FavoritesScreen() {
  const {
    favoriteCities,
    isLoadingFavorites,
    removeFavorite,
  } = useFavorites();

  if (isLoadingFavorites) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />

        <Text>
          Favoriten werden geladen...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Favoriten
      </Text>

      <FlatList
        data={favoriteCities}
        keyExtractor={(city) => city.id}
        contentContainerStyle={
          styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Noch keine Favoriten
            </Text>

            <Text style={styles.emptyText}>
              Suche im Wetter-Tab nach einer
              Stadt und tippe auf den Stern.
            </Text>
          </View>
        }
        renderItem={({ item: city }) => (
          <View style={styles.favoriteItem}>
            <View style={styles.cityInfo}>
              <Text style={styles.cityName}>
                {city.name}
              </Text>

              <Text style={styles.cityLocation}>
                {city.region
                  ? `${city.region}, `
                  : ''}

                {city.country}
              </Text>
            </View>

            <Pressable
              style={styles.removeButton}
              onPress={() =>
                void removeFavorite(city.id)
              }
            >
              <Text
                style={styles.removeButtonText}
              >
                ★
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },

  listContent: {
    gap: 12,
  },

  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },

  cityInfo: {
    flex: 1,
  },

  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  cityLocation: {
    marginTop: 4,
    color: '#666',
  },

  removeButton: {
    padding: 8,
  },

  removeButtonText: {
    fontSize: 28,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
});