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
  /*
   * Ignore events for widgets other than
   * our CurrentWeather widget.
   */
  if (
    props.widgetInfo.widgetName !==
    'CurrentWeather'
  ) {
    return;
  }

  switch (props.widgetAction) {
    /*
     * Widget was added to the home screen.
     */
    case 'WIDGET_ADDED': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * Android requested an update.
     */
    case 'WIDGET_UPDATE': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * Widget size changed.
     */
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props
      );

      break;
    }

    /*
     * A clickable element inside the
     * widget was pressed.
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

    /*
     * Nothing needs to be cleaned up
     * when the widget is removed.
     */
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
  /*
   * Read the most recent location that
   * the main app stored for the widget.
   */
  let city;

  try {
    city =
      await getStoredCurrentCity();
  } catch (error) {
    console.error(
      'Failed to read widget location:',
      error
    );

    renderMessage(
      props,
      null,
      'Stored location could not be read.'
    );

    return;
  }

  /*
   * The main app has not stored a location
   * yet.
   */
  if (!city) {
    renderMessage(
      props,
      null,
      'Open JustWeather once to set your location.'
    );

    return;
  }

  /*
   * Request fresh weather data.
   */
  try {
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
  city: Awaited<
    ReturnType<
      typeof getStoredCurrentCity
    >
  >,
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