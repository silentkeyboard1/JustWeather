import * as Location from 'expo-location';

import { searchCities } from '../../city-search/api/searchCities';

import type { City } from '../../city-search/model/city';

import {
  saveCurrentCity,
} from '../storage/currentCityStorage';

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

  const detectedCityName =
    address?.city ??
    address?.district ??
    address?.subregion;

  let englishCity:
    | City
    | null = null;

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
      console.warn(
        'Failed to resolve English city name:',
        error
      );
    }
  }

  const currentCity: City = {
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

    latitude,

    longitude,
  };

  /*
   * Store the latest GPS location
   * so the Android widget can use it
   * even when the main UI is not open.
   */
  try {
    await saveCurrentCity(
      currentCity
    );
  } catch (error) {
    console.warn(
      'Failed to store current city for widget:',
      error
    );
  }

  return currentCity;
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