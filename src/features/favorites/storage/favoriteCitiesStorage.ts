import AsyncStorage from '@react-native-async-storage/async-storage';

import type { City } from '../../city-search/model/city';

const FAVORITE_CITIES_KEY = 'favorite-cities';

export async function getFavoriteCities(): Promise<City[]> {
  const storedFavorites = await AsyncStorage.getItem(
    FAVORITE_CITIES_KEY
  );

  if (!storedFavorites) {
    return [];
  }

  return JSON.parse(storedFavorites) as City[];
}

export async function saveFavoriteCities(
  cities: City[]
): Promise<void> {
  await AsyncStorage.setItem(
    FAVORITE_CITIES_KEY,
    JSON.stringify(cities)
  );
}