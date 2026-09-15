import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import type {
  ReactNode,
} from 'react';

import {
  Alert,
  Platform,
} from 'react-native';

import * as Location from 'expo-location';

import {
  requestWidgetUpdate,
} from 'react-native-android-widget';

import type {
  City,
} from '../../city-search/model/city';

import {
  getWeather,
} from '../../weather/api/getWeather';

import {
  CurrentWeatherWidget,
} from '../components/CurrentWeatherWidget';

import {
  clearWidgetCity,
  getWidgetCity,
  saveWidgetCity,
} from '../storage/widgetCityStorage';

import {
  resolveWidgetCity,
} from '../utils/resolveWidgetCity';

type WidgetCityContextValue = {
  widgetCity:
    City | null;

  isWidgetCity: (
    city: City
  ) => boolean;

  selectWidgetCity: (
    city: City
  ) => Promise<void>;
};

const WidgetCityContext =
  createContext<
    WidgetCityContextValue | undefined
  >(undefined);

type WidgetCityProviderProps = {
  children: ReactNode;
};

export function WidgetCityProvider({
  children,
}: WidgetCityProviderProps) {
  /*
   * null means:
   *
   * no manual override,
   * therefore use current location.
   */
  const [
    widgetCity,
    setWidgetCity,
  ] =
    useState<City | null>(
      null
    );

  useEffect(() => {
    let isMounted =
      true;

    async function loadWidgetCity() {
      try {
        const storedCity =
          await getWidgetCity();

        if (!isMounted) {
          return;
        }

        setWidgetCity(
          storedCity
        );
      } catch (error) {
        console.error(
          'Failed to load widget city:',
          error
        );
      }
    }

    void loadWidgetCity();

    return () => {
      isMounted =
        false;
    };
  }, []);

  function isWidgetCity(
    city: City
  ) {
    /*
     * No manually selected city means
     * current location is selected.
     */
    if (
      city.id ===
      'current-location'
    ) {
      return (
        widgetCity ===
        null
      );
    }

    return (
      widgetCity?.id ===
      city.id
    );
  }

  async function selectWidgetCity(
    city: City
  ) {
    /*
     * CURRENT LOCATION
     */
    if (
      city.id ===
      'current-location'
    ) {
      /*
       * Remove any manually selected
       * city override.
       */
      await clearWidgetCity();

      setWidgetCity(
        null
      );

      /*
       * Ask for background location so
       * hourly widget refreshes can use
       * the real device position.
       */
      await ensureBackgroundLocationPermission();

      /*
       * Resolve the best current location
       * and immediately refresh the widget.
       */
      const resolvedCity =
        await resolveWidgetCity();

      if (resolvedCity) {
        await updateAndroidWidget(
          resolvedCity
        );
      }

      return;
    }

    /*
     * MANUALLY SELECTED CITY
     */
    await saveWidgetCity(
      city
    );

    setWidgetCity(
      city
    );

    await updateAndroidWidget(
      city
    );
  }

  return (
    <WidgetCityContext.Provider
      value={{
        widgetCity,
        isWidgetCity,
        selectWidgetCity,
      }}
    >
      {children}
    </WidgetCityContext.Provider>
  );
}

async function ensureBackgroundLocationPermission():
  Promise<void> {
  if (
    Platform.OS !==
    'android'
  ) {
    return;
  }

  const foregroundPermission =
    await Location.getForegroundPermissionsAsync();

  /*
   * Background location cannot be granted
   * unless foreground location has already
   * been granted.
   */
  if (
    foregroundPermission.status !==
    'granted'
  ) {
    return;
  }

  const backgroundPermission =
    await Location.getBackgroundPermissionsAsync();

  if (
    backgroundPermission.status ===
    'granted'
  ) {
    return;
  }

  /*
   * Android 11+ may open the app's
   * settings screen when requesting
   * background location.
   *
   * Explain why before doing that.
   */
  const shouldContinue =
    await showBackgroundLocationExplanation();

  if (!shouldContinue) {
    return;
  }

  try {
    await Location.requestBackgroundPermissionsAsync();
  } catch (error) {
    console.warn(
      'Background location permission was not granted:',
      error
    );
  }
}

function showBackgroundLocationExplanation():
  Promise<boolean> {
  return new Promise(
    (resolve) => {
      Alert.alert(
        'Allow widget location',
        'To keep the weather widget updated with your real current location, JustWeather needs location access while the app is not open.',
        [
          {
            text:
              'Not now',

            style:
              'cancel',

            onPress: () =>
              resolve(
                false
              ),
          },
          {
            text:
              'Continue',

            onPress: () =>
              resolve(
                true
              ),
          },
        ],
        {
          cancelable:
            true,

          onDismiss: () =>
            resolve(
              false
            ),
        }
      );
    }
  );
}

async function updateAndroidWidget(
  city: City
) {
  if (
    Platform.OS !==
    'android'
  ) {
    return;
  }

  try {
    const weather =
      await getWeather(
        city
      );

    await requestWidgetUpdate({
      widgetName:
        'CurrentWeather',

      renderWidget: () => ({
        light: (
          <CurrentWeatherWidget
            theme="light"
            city={city}
            weather={weather}
          />
        ),

        dark: (
          <CurrentWeatherWidget
            theme="dark"
            city={city}
            weather={weather}
          />
        ),
      }),
    });
  } catch (error) {
    console.error(
      'Failed to update Android widget:',
      error
    );
  }
}

export function useWidgetCity() {
  const context =
    useContext(
      WidgetCityContext
    );

  if (!context) {
    throw new Error(
      'useWidgetCity must be used inside WidgetCityProvider.'
    );
  }

  return context;
}