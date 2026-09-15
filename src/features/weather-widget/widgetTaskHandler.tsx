import type {
  WidgetTaskHandlerProps,
} from 'react-native-android-widget';

import {
  getWeather,
} from '../weather/api/getWeather';

import {
  CurrentWeatherWidget,
} from './components/CurrentWeatherWidget';

import {
  resolveWidgetCity,
} from './utils/resolveWidgetCity';

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
) {
  if (
    props.widgetInfo.widgetName !==
    'CurrentWeather'
  ) {
    return;
  }

  switch (props.widgetAction) {
    /*
     * Widget has just been added.
     */
    case 'WIDGET_ADDED': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * Android triggers this automatically.
     *
     * app.json now requests this roughly
     * once every hour.
     */
    case 'WIDGET_UPDATE': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * Re-render after resizing.
     */
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * Manual refresh button.
     */
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

    case 'WIDGET_DELETED': {
      break;
    }

    default: {
      break;
    }
  }
}

async function renderLiveWeather(
  props: WidgetTaskHandlerProps
) {
  let city;

  /*
   * Determine which location to use.
   *
   * Explicit widget city:
   * → selected city
   *
   * No explicit city:
   * → live current location if allowed
   * → otherwise stored current location
   */
  try {
    city =
      await resolveWidgetCity();
  } catch (error) {
    console.error(
      'Failed to resolve widget location:',
      error
    );

    renderMessage(
      props,
      null,
      'Widget location could not be determined.'
    );

    return;
  }

  if (!city) {
    renderMessage(
      props,
      null,
      'Open JustWeather once to set your location.'
    );

    return;
  }

  /*
   * Fetch fresh weather for the resolved
   * city / coordinates.
   */
  try {
    const weather =
      await getWeather(
        city
      );

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
      'Widget weather update failed:',
      error
    );

    renderMessage(
      props,
      city,
      'Weather unavailable. Tap refresh to try again.'
    );
  }
}

function renderMessage(
  props: WidgetTaskHandlerProps,
  city:
    | Awaited<
        ReturnType<
          typeof resolveWidgetCity
        >
      >
    | null,
  message: string
) {
  try {
    props.renderWidget({
      light: (
        <CurrentWeatherWidget
          theme="light"
          city={city}
          weather={null}
          message={message}
        />
      ),

      dark: (
        <CurrentWeatherWidget
          theme="dark"
          city={city}
          weather={null}
          message={message}
        />
      ),
    });
  } catch (error) {
    console.error(
      'Widget error state could not be rendered:',
      error
    );
  }
}