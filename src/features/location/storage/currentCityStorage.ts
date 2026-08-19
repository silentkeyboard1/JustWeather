import AsyncStorage from '@react-native-async-storage/async-storage';

import type { City } from '../../city-search/model/city';

const CURRENT_CITY_KEY =
  'current-city-for-widget';

export async function saveCurrentCity(
  city: City
): Promise<void> {
  await AsyncStorage.setItem(
    CURRENT_CITY_KEY,
    JSON.stringify(city)
  );
}

export async function getStoredCurrentCity():
  Promise<City | null> {
  const storedCity =
    await AsyncStorage.getItem(
      CURRENT_CITY_KEY
    );

  if (!storedCity) {
    return null;
  }

  try {
    return JSON.parse(
      storedCity
    ) as City;
  } catch {
    return null;
  }
}