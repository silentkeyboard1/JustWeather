import {
  Platform,
} from 'react-native';

import {
  requestWidgetUpdate,
} from 'react-native-android-widget';

import {
  getWeather,
} from '../weather/api/getWeather';

import {
  getStoredAccentColor,
} from '../../shared/theme/themeStorage';

import {
  createWeatherWidgetRepresentation,
  getWidgetSize,
} from './renderWeatherWidget';

import {
  resolveWidgetCity,
} from './utils/resolveWidgetCity';

import {
  setWidgetAccentColor,
} from './utils/widgetTheme';

const WIDGET_NAMES = [
  'CurrentWeather',
  'CurrentWeatherCompact',
  'CurrentWeatherVertical',
  'CurrentWeatherSquare',
  'CurrentWeatherMini',
] as const;

export async function updateAllWeatherWidgets() {
  if (
    Platform.OS !==
    'android'
  ) {
    return;
  }

  try {
    /*
     * First load the newly saved theme.
     */
    const accentColor =
      await getStoredAccentColor();

    setWidgetAccentColor(
      accentColor
    );

    /*
     * Then resolve weather only once.
     *
     * All five widget designs use the
     * same city/weather data.
     */
    const city =
      await resolveWidgetCity();

    if (!city) {
      return;
    }

    const weather =
      await getWeather(
        city
      );

    for (
      const widgetName of
      WIDGET_NAMES
    ) {
      const widgetSize =
        getWidgetSize(
          widgetName
        );

      if (!widgetSize) {
        continue;
      }

      await requestWidgetUpdate({
        widgetName,

        renderWidget: () =>
          createWeatherWidgetRepresentation(
            widgetSize,
            city,
            weather
          ),
      });
    }
  } catch (error) {
    /*
     * Theme changes should never make the
     * Settings screen fail just because
     * weather/network/location is unavailable.
     */
    console.warn(
      'Could not immediately update weather widgets:',
      error
    );
  }
}