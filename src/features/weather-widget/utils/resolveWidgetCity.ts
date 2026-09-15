import * as Location from 'expo-location';

import type {
  City,
} from '../../city-search/model/city';

import {
  getCurrentCity,
} from '../../location/api/getCurrentCity';

import {
  getStoredCurrentCity,
} from '../../location/storage/currentCityStorage';

import {
  getWidgetCity,
} from '../storage/widgetCityStorage';

const LIVE_LOCATION_TIMEOUT =
  6000;

export async function resolveWidgetCity():
  Promise<City | null> {
  /*
   * First priority:
   *
   * Has the user explicitly selected
   * a city for the widget?
   */
  const selectedWidgetCity =
    await getWidgetCity();

  if (selectedWidgetCity) {
    return selectedWidgetCity;
  }

  /*
   * No manually selected city means:
   *
   * use current location.
   */
  const foregroundPermission =
    await Location.getForegroundPermissionsAsync();

  const backgroundPermission =
    await Location.getBackgroundPermissionsAsync();

  /*
   * We can only request a live location
   * from the background when both
   * permissions are available.
   */
  if (
    foregroundPermission.status ===
      'granted' &&
    backgroundPermission.status ===
      'granted'
  ) {
    try {
      const liveCity =
        await getLiveCurrentCityWithTimeout();

      return liveCity;
    } catch (error) {
      console.warn(
        'Live widget location unavailable. Using stored location instead.',
        error
      );
    }
  }

  /*
   * Fallback:
   *
   * Use the last location that the main
   * app successfully saved.
   */
  return getStoredCurrentCity();
}

async function getLiveCurrentCityWithTimeout():
  Promise<City> {
  const timeout =
    new Promise<never>(
      (_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              'Widget live location timed out.'
            )
          );
        }, LIVE_LOCATION_TIMEOUT);
      }
    );

  return Promise.race([
    getCurrentCity(),
    timeout,
  ]);
}