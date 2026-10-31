import type {
  WidgetTaskHandlerProps,
} from 'react-native-android-widget';

import type {
  City,
} from '../city-search/model/city';

import {
  getWeather,
} from '../weather/api/getWeather';

import type {
  Weather,
} from '../weather/model/weather';

import {
  getStoredAccentColor,
} from '../../shared/theme/themeStorage';

import {
  createWeatherWidgetRepresentation,
  getWidgetSize,
  type WidgetSize,
} from './renderWeatherWidget';

import {
  resolveWidgetCity,
} from './utils/resolveWidgetCity';

import {
  setWidgetAccentColor,
} from './utils/widgetTheme';

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
) {
  const widgetSize =
    getWidgetSize(
      props.widgetInfo.widgetName
    );

  if (!widgetSize) {
    return;
  }

  /*
   * Load the exact same accent setting
   * that the normal application uses.
   */
  await loadWidgetTheme();

  switch (
    props.widgetAction
  ) {
    case 'WIDGET_ADDED': {
      await renderLiveWeather(
        props,
        widgetSize,
        true
      );

      break;
    }

    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props,
        widgetSize,
        false
      );

      break;
    }

    case 'WIDGET_CLICK': {
      if (
        props.clickAction ===
        'REFRESH_WEATHER'
      ) {
        await renderLiveWeather(
          props,
          widgetSize,
          false
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

async function loadWidgetTheme() {
  try {
    const accentColor =
      await getStoredAccentColor();

    setWidgetAccentColor(
      accentColor
    );
  } catch (error) {
    console.warn(
      'Failed to load widget theme:',
      error
    );

    setWidgetAccentColor(
      null
    );
  }
}

async function renderLiveWeather(
  props: WidgetTaskHandlerProps,
  widgetSize: WidgetSize,
  showErrorIfEmpty: boolean
) {
  let city:
    | City
    | null;

  try {
    city =
      await resolveWidgetCity();
  } catch (error) {
    console.error(
      'Widget location resolution failed:',
      error
    );

    if (
      !showErrorIfEmpty
    ) {
      return;
    }

    renderMessage(
      props,
      widgetSize,
      null,
      'Open JustWeather once to set your location.'
    );

    return;
  }

  if (!city) {
    if (
      !showErrorIfEmpty
    ) {
      return;
    }

    renderMessage(
      props,
      widgetSize,
      null,
      'Open JustWeather once to set your location.'
    );

    return;
  }

  let weather:
    Weather;

  try {
    weather =
      await getWeather(
        city
      );
  } catch (error) {
    console.error(
      'Widget weather request failed:',
      error
    );

    /*
     * Keep existing weather if this was
     * merely a refresh failure.
     */
    if (
      !showErrorIfEmpty
    ) {
      return;
    }

    renderMessage(
      props,
      widgetSize,
      city,
      'Weather unavailable. Tap refresh to try again.'
    );

    return;
  }

  props.renderWidget(
    createWeatherWidgetRepresentation(
      widgetSize,
      city,
      weather
    )
  );
}

function renderMessage(
  props: WidgetTaskHandlerProps,
  widgetSize: WidgetSize,
  city: City | null,
  message: string
) {
  try {
    props.renderWidget(
      createWeatherWidgetRepresentation(
        widgetSize,
        city,
        null,
        message
      )
    );
  } catch (error) {
    console.error(
      'Widget error state could not be rendered:',
      error
    );
  }
}