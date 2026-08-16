import * as Location from 'expo-location';

import type { City } from '../../city-search/model/city';

export async function getCurrentCity(): Promise<City> {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (permission.status !== 'granted') {
    throw new Error(
      'LOCATION_PERMISSION_DENIED'
    );
  }

  const position =
    await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

  const {
    latitude,
    longitude,
  } = position.coords;

  const addresses =
    await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

  const address = addresses[0];

  return {
    id: 'current-location',

    name:
      address?.city ??
      'Aktueller Standort',

    country:
      address?.country ?? '',

    region:
      address?.region ?? undefined,

    latitude,
    longitude,
  };
}