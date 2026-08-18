import type {
  WidgetTaskHandlerProps,
} from 'react-native-android-widget';

import {
  getStoredCurrentCity,
} from '../location/storage/currentCityStorage';

import {
  getWeather,
} from '../weather/api/getWeather';

import {
  CurrentWeatherWidget,
} from './components/CurrentWeatherWidget';

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
) {
  if (
    props.widgetInfo
      .widgetName !==
    'CurrentWeather'
  ) {
    return;
  }

  switch (
    props.widgetAction
  ) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props
      );

      break;
    }

    case 'WIDGET_CLICK': {
      if (
        props.clickAction ===
        'REFRESH_WEATHER'
      ) {
        await renderLiveWeather(
          props
        );
      }

      break;
    }

    case 'WIDGET_DELETED':
      break;

    default:
      break;
  }
}

async function renderLiveWeather(
  props: WidgetTaskHandlerProps
) {
  const city =
    await getStoredCurrentCity();

  /*
   * The user has not opened the main
   * app yet, so we have no location.
   */
  if (!city) {
    props.renderWidget({
      light: (
        <CurrentWeatherWidget
          theme="light"
          city={null}
          weather={null}
          message="Open JustWeather once to set your location."
        />
      ),

      dark: (
        <CurrentWeatherWidget
          theme="dark"
          city={null}
          weather={null}
          message="Open JustWeather once to set your location."
        />
      ),
    });

    return;
  }

  try {
    /*
     * This uses the same Open-Meteo
     * function as the normal app.
     *
     * So the widget and app share the
     * same data model and API mapping.
     */
    const weather =
      await getWeather(city);

    props.renderWidget({
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
    });
  } catch (error) {
    console.error(
      'Widget weather refresh failed:',
      error
    );

    props.renderWidget({
      light: (
        <CurrentWeatherWidget
          theme="light"
          city={city}
          weather={null}
          message="Weather unavailable. Tap refresh to try again."
        />
      ),

      dark: (
        <CurrentWeatherWidget
          theme="dark"
          city={city}
          weather={null}
          message="Weather unavailable. Tap refresh to try again."
        />
      ),
    });
  }
}