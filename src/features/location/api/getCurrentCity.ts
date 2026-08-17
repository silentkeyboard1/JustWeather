import * as Location from 'expo-location';

import { searchCities } from '../../city-search/api/searchCities';

import type { City } from '../../city-search/model/city';

export async function getCurrentCity(): Promise<City> {
  const permission =
    await Location.requestForegroundPermissionsAsync();

  if (
    permission.status !==
    'granted'
  ) {
    throw new Error(
      'LOCATION_PERMISSION_DENIED'
    );
  }

  const position =
    await Location.getCurrentPositionAsync(
      {
        accuracy:
          Location.Accuracy.Balanced,
      }
    );

  const {
    latitude,
    longitude,
  } = position.coords;

  const addresses =
    await Location.reverseGeocodeAsync(
      {
        latitude,
        longitude,
      }
    );

  const address =
    addresses[0];

  /*
   * Expo gives us the city name
   * provided by the operating system.
   *
   * That name may be localized,
   * e.g. "Praha" instead of "Prague".
   */
  const detectedCityName =
    address?.city ??
    address?.district ??
    address?.subregion;

  let englishCity:
    | City
    | null = null;

  /*
   * Try to resolve the detected city
   * through our Open-Meteo search.
   *
   * searchCities() requests
   * language=en.
   */
  if (detectedCityName) {
    try {
      const countryCode =
        address?.isoCountryCode;

      const searchTerm =
        countryCode
          ? `${detectedCityName}, ${countryCode}`
          : detectedCityName;

      const candidates =
        await searchCities(
          searchTerm
        );

      if (
        candidates.length > 0
      ) {
        englishCity =
          findNearestCity(
            candidates,
            latitude,
            longitude
          );
      }
    } catch (error) {
      /*
       * Weather should still work even
       * if translating the city name
       * fails.
       */
      console.warn(
        'Failed to resolve English city name:',
        error
      );
    }
  }

  return {
    /*
     * Keep this special ID.
     *
     * Home uses it to distinguish the
     * current location from favorites.
     */
    id: 'current-location',

    name:
      englishCity?.name ??
      detectedCityName ??
      'Current location',

    country:
      englishCity?.country ??
      address?.country ??
      '',

    region:
      englishCity?.region ??
      address?.region ??
      undefined,

    /*
     * Keep the real GPS coordinates,
     * not the center coordinates
     * returned by the city geocoder.
     *
     * This gives us weather for the
     * user's actual position.
     */
    latitude,

    longitude,
  };
}

function findNearestCity(
  cities: City[],
  latitude: number,
  longitude: number
): City {
  return cities.reduce(
    (
      nearestCity,
      currentCity
    ) => {
      const nearestDistance =
        getCoordinateDistance(
          nearestCity.latitude,
          nearestCity.longitude,
          latitude,
          longitude
        );

      const currentDistance =
        getCoordinateDistance(
          currentCity.latitude,
          currentCity.longitude,
          latitude,
          longitude
        );

      return currentDistance <
        nearestDistance
        ? currentCity
        : nearestCity;
    }
  );
}

function getCoordinateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const latitudeDifference =
    latitude1 - latitude2;

  const longitudeDifference =
    longitude1 - longitude2;

  return (
    latitudeDifference *
      latitudeDifference +
    longitudeDifference *
      longitudeDifference
  );
}