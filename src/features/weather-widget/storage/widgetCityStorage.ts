import AsyncStorage from '@react-native-async-storage/async-storage';

import type { City } from '../../city-search/model/city';

const WIDGET_CITY_KEY =
  'selected-widget-city';

export async function getWidgetCity():
  Promise<City | null> {
  const storedCity =
    await AsyncStorage.getItem(
      WIDGET_CITY_KEY
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

export async function saveWidgetCity(
  city: City
): Promise<void> {
  await AsyncStorage.setItem(
    WIDGET_CITY_KEY,
    JSON.stringify(city)
  );
}

export async function clearWidgetCity():
  Promise<void> {
  await AsyncStorage.removeItem(
    WIDGET_CITY_KEY
  );
}