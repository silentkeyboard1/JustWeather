import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  Platform,
} from 'react-native';

import {
  requestWidgetUpdate,
} from 'react-native-android-widget';

import type { City } from '../../city-search/model/city';

import {
  getStoredCurrentCity,
} from '../../location/storage/currentCityStorage';

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

type WidgetCityContextValue = {
  widgetCity: City | null;

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
  children: React.ReactNode;
};

export function WidgetCityProvider({
  children,
}: WidgetCityProviderProps) {
  /*
   * null means:
   *
   * use the user's current location.
   */
  const [
    widgetCity,
    setWidgetCity,
  ] = useState<City | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

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
      isMounted = false;
    };
  }, []);

  function isWidgetCity(
    city: City
  ) {
    /*
     * No explicit city selected:
     * current location is the widget source.
     */
    if (
      city.id ===
      'current-location'
    ) {
      return widgetCity === null;
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
     * Selecting the current location
     * removes the explicit override.
     */
    if (
      city.id ===
      'current-location'
    ) {
      await clearWidgetCity();

      setWidgetCity(null);

      const currentCity =
        await getStoredCurrentCity();

      if (currentCity) {
        await updateAndroidWidget(
          currentCity
        );
      }

      return;
    }

    /*
     * Store an explicit city for the widget.
     */
    await saveWidgetCity(city);

    setWidgetCity(city);

    /*
     * Update the Android widget immediately
     * instead of waiting for the user to
     * press its refresh button.
     */
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

async function updateAndroidWidget(
  city: City
) {
  if (
    Platform.OS !== 'android'
  ) {
    return;
  }

  try {
    const weather =
      await getWeather(city);

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
    /*
     * City selection should still succeed
     * even if the widget cannot immediately
     * fetch new weather.
     *
     * Its own refresh button can retry later.
     */
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