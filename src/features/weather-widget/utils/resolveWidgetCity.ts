import * as Location from 'expo-location';

import type {
  City,
} from '../../city-search/model/city';

import {
  searchCities,
} from '../../city-search/api/searchCities';

import {
  getStoredCurrentCity,
  saveCurrentCity,
} from '../../location/storage/currentCityStorage';

import {
  getWidgetCity,
} from '../storage/widgetCityStorage';

const LIVE_LOCATION_TIMEOUT =
  6000;

export async function resolveWidgetCity():
  Promise<City | null> {
  /*
   * -----------------------------------
   * 1. MANUALLY SELECTED WIDGET CITY
   * -----------------------------------
   *
   * This always has highest priority.
   */
  try {
    const selectedWidgetCity =
      await getWidgetCity();

    if (selectedWidgetCity) {
      return selectedWidgetCity;
    }
  } catch (error) {
    /*
     * Storage failure should not stop the
     * widget from trying current location.
     */
    console.warn(
      'Failed to read selected widget city:',
      error
    );
  }

  /*
   * -----------------------------------
   * 2. TRY LIVE CURRENT LOCATION
   * -----------------------------------
   */
  const liveCity =
    await tryLiveCurrentLocation();

  if (liveCity) {
    /*
     * Save every successful live location.
     *
     * This becomes our reliable fallback
     * for future background refreshes.
     */
    try {
      await saveCurrentCity(
        liveCity
      );
    } catch (error) {
      console.warn(
        'Failed to store live widget location:',
        error
      );
    }

    return liveCity;
  }

  /*
   * -----------------------------------
   * 3. TRY ANDROID LAST KNOWN LOCATION
   * -----------------------------------
   *
   * This is much faster and more reliable
   * than demanding a fresh GPS fix.
   */
  const lastKnownCity =
    await tryLastKnownLocation();

  if (lastKnownCity) {
    try {
      await saveCurrentCity(
        lastKnownCity
      );
    } catch (error) {
      console.warn(
        'Failed to store last known widget location:',
        error
      );
    }

    return lastKnownCity;
  }

  /*
   * -----------------------------------
   * 4. LAST STORED APP LOCATION
   * -----------------------------------
   *
   * This should work even if:
   *
   * - GPS is temporarily unavailable
   * - the phone is indoors
   * - background location fails
   * - Android delays location access
   */
  try {
    const storedCity =
      await getStoredCurrentCity();

    if (storedCity) {
      return storedCity;
    }
  } catch (error) {
    console.warn(
      'Failed to read stored current location:',
      error
    );
  }

  /*
   * Nothing usable was available.
   */
  return null;
}

async function tryLiveCurrentLocation():
  Promise<City | null> {
  try {
    const foregroundPermission =
      await Location.getForegroundPermissionsAsync();

    if (
      foregroundPermission.status !==
      'granted'
    ) {
      return null;
    }

    /*
     * When running from the widget in the
     * background, Android may require
     * background-location permission.
     */
    const backgroundPermission =
      await Location.getBackgroundPermissionsAsync();

    if (
      backgroundPermission.status !==
      'granted'
    ) {
      return null;
    }

    const location =
      await getCurrentPositionWithTimeout();

    return createCityFromLocation(
      location
    );
  } catch (error) {
    console.warn(
      'Live widget location unavailable:',
      error
    );

    return null;
  }
}

async function tryLastKnownLocation():
  Promise<City | null> {
  try {
    const foregroundPermission =
      await Location.getForegroundPermissionsAsync();

    if (
      foregroundPermission.status !==
      'granted'
    ) {
      return null;
    }

    const location =
      await Location.getLastKnownPositionAsync();

    if (!location) {
      return null;
    }

    return createCityFromLocation(
      location
    );
  } catch (error) {
    console.warn(
      'Last known widget location unavailable:',
      error
    );

    return null;
  }
}

async function getCurrentPositionWithTimeout():
  Promise<Location.LocationObject> {
  const locationPromise =
    Location.getCurrentPositionAsync(
      {
        /*
         * Balanced accuracy is more suitable
         * for a weather widget.
         *
         * We do not need meter-level GPS
         * precision to retrieve weather.
         */
        accuracy:
          Location.Accuracy.Balanced,
      }
    );

  const timeoutPromise =
    new Promise<never>(
      (_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Widget location request timed out.'
            )
          );
        }, LIVE_LOCATION_TIMEOUT);
      }
    );

  return Promise.race([
    locationPromise,
    timeoutPromise,
  ]);
}

async function createCityFromLocation(
  location: Location.LocationObject
): Promise<City> {
  const {
    latitude,
    longitude,
  } =
    location.coords;

  /*
   * Start with a completely usable city
   * object immediately.
   *
   * Weather only requires the coordinates.
   */
  let cityName =
    'Current location';

  let country =
    '';

  let region:
    | string
    | undefined;

  /*
   * Reverse geocoding is only needed for
   * the human-readable name.
   *
   * If this fails, weather can still load.
   */
  try {
    const addresses =
      await Location.reverseGeocodeAsync(
        {
          latitude,
          longitude,
        }
      );

    const address =
      addresses[0];

    if (address) {
      const detectedCityName =
        address.city ??
        address.district ??
        address.subregion;

      country =
        address.country ??
        '';

      region =
        address.region ??
        undefined;

      if (detectedCityName) {
        cityName =
          detectedCityName;

        /*
         * Try resolving the city through
         * Open-Meteo so the displayed name
         * is consistently English.
         */
        try {
          const countryCode =
            address.isoCountryCode;

          const searchTerm =
            countryCode
              ? `${detectedCityName}, ${countryCode}`
              : detectedCityName;

          const candidates =
            await searchCities(
              searchTerm
            );

          if (
            candidates.length >
            0
          ) {
            const nearestCity =
              findNearestCity(
                candidates,
                latitude,
                longitude
              );

            cityName =
              nearestCity.name;

            country =
              nearestCity.country;

            region =
              nearestCity.region;
          }
        } catch (error) {
          /*
           * Naming failure is not important
           * enough to reject good coordinates.
           */
          console.warn(
            'Failed to resolve English widget city name:',
            error
          );
        }
      }
    }
  } catch (error) {
    console.warn(
      'Widget reverse geocoding failed:',
      error
    );
  }

  return {
    id:
      'current-location',

    name:
      cityName,

    country,

    region,

    /*
     * Always keep the real coordinates.
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
    latitude1 -
    latitude2;

  const longitudeDifference =
    longitude1 -
    longitude2;

  return (
    latitudeDifference *
      latitudeDifference +
    longitudeDifference *
      longitudeDifference
  );
}