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

import {
  getWidgetCity,
} from './storage/widgetCityStorage';

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
) {
  if (
    props.widgetInfo.widgetName !==
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

  try {
    /*
     * First check whether the user has
     * explicitly selected a widget city.
     */
    const selectedWidgetCity =
      await getWidgetCity();

    if (selectedWidgetCity) {
      city =
        selectedWidgetCity;
    } else {
      /*
       * No override:
       * use current location.
       */
      city =
        await getStoredCurrentCity();
    }
  } catch (error) {
    console.error(
      'Failed to read widget city:',
      error
    );

    renderMessage(
      props,
      null,
      'Widget location could not be read.'
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