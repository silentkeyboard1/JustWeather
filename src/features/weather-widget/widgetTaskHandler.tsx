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
  CompactCurrentWeatherWidget,
} from './components/CompactCurrentWeatherWidget';

import {
  CurrentWeatherWidget,
} from './components/CurrentWeatherWidget';

import {
  MiniCurrentWeatherWidget,
} from './components/MiniCurrentWeatherWidget';

import {
  SquareCurrentWeatherWidget,
} from './components/SquareCurrentWeatherWidget';

import {
  VerticalCurrentWeatherWidget,
} from './components/VerticalCurrentWeatherWidget';

import {
  resolveWidgetCity,
} from './utils/resolveWidgetCity';

type WidgetSize =
  | 'large'
  | 'compact'
  | 'vertical'
  | 'square'
  | 'mini';

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

  switch (
    props.widgetAction
  ) {
    /*
     * A completely new widget needs
     * something rendered even if the first
     * request fails.
     */
    case 'WIDGET_ADDED': {
      await renderLiveWeather(
        props,
        widgetSize,
        true
      );

      break;
    }

    /*
     * Periodic refresh.
     *
     * If this fails, keep whatever weather
     * is already visible on the widget.
     */
    case 'WIDGET_UPDATE': {
      await renderLiveWeather(
        props,
        widgetSize,
        false
      );

      break;
    }

    /*
     * Same principle when resizing:
     * don't replace valid weather with an
     * error because GPS/network happened
     * to fail at that exact moment.
     */
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props,
        widgetSize,
        false
      );

      break;
    }

    /*
     * Manual refresh.
     *
     * A failed refresh also keeps the old
     * weather instead of showing an error.
     */
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

function getWidgetSize(
  widgetName: string
): WidgetSize | null {
  if (
    widgetName ===
    'CurrentWeather'
  ) {
    return 'large';
  }

  if (
    widgetName ===
    'CurrentWeatherCompact'
  ) {
    return 'compact';
  }

  if (
    widgetName ===
    'CurrentWeatherVertical'
  ) {
    return 'vertical';
  }

  if (
    widgetName ===
    'CurrentWeatherSquare'
  ) {
    return 'square';
  }

  if (
    widgetName ===
    'CurrentWeatherMini'
  ) {
    return 'mini';
  }

  return null;
}

async function renderLiveWeather(
  props: WidgetTaskHandlerProps,
  widgetSize: WidgetSize,
  showErrorIfNothingRendered: boolean
) {
  /*
   * -----------------------------------
   * 1. RESOLVE LOCATION
   * -----------------------------------
   */
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

    /*
     * Existing widget:
     * leave old data untouched.
     */
    if (
      !showErrorIfNothingRendered
    ) {
      console.log(
        'Widget: keeping previous weather because location refresh failed.'
      );

      return;
    }

    /*
     * Newly-added widget:
     * there is no old data yet, so show
     * a useful message.
     */
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
      !showErrorIfNothingRendered
    ) {
      console.log(
        'Widget: no location available, keeping previous weather.'
      );

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

  /*
   * -----------------------------------
   * 2. FETCH WEATHER
   * -----------------------------------
   */
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
     * This is the key behavior:
     *
     * If weather was already shown, don't
     * overwrite it just because Internet
     * is temporarily unavailable.
     */
    if (
      !showErrorIfNothingRendered
    ) {
      console.log(
        'Widget: keeping previous weather because the weather refresh failed.'
      );

      return;
    }

    /*
     * Only a brand-new widget gets an
     * error state, because it has nothing
     * useful to preserve yet.
     */
    renderMessage(
      props,
      widgetSize,
      city,
      'Weather unavailable. Tap refresh to try again.'
    );

    return;
  }

  /*
   * -----------------------------------
   * 3. SUCCESS
   * -----------------------------------
   */
  try {
    renderWeather(
      props,
      widgetSize,
      city,
      weather
    );
  } catch (error) {
    console.error(
      'Widget render failed:',
      error
    );

    /*
     * Again, do not destroy an existing
     * good widget because one render failed.
     */
    if (
      !showErrorIfNothingRendered
    ) {
      return;
    }

    renderMessage(
      props,
      widgetSize,
      city,
      'Widget unavailable.'
    );
  }
}

function renderWeather(
  props: WidgetTaskHandlerProps,
  widgetSize: WidgetSize,
  city: City,
  weather: Weather
) {
  if (
    widgetSize ===
    'compact'
  ) {
    props.renderWidget({
      light: (
        <CompactCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
        />
      ),

      dark: (
        <CompactCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
        />
      ),
    });

    return;
  }

  if (
    widgetSize ===
    'vertical'
  ) {
    props.renderWidget({
      light: (
        <VerticalCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
        />
      ),

      dark: (
        <VerticalCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
        />
      ),
    });

    return;
  }

  if (
    widgetSize ===
    'square'
  ) {
    props.renderWidget({
      light: (
        <SquareCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
        />
      ),

      dark: (
        <SquareCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
        />
      ),
    });

    return;
  }

  if (
    widgetSize ===
    'mini'
  ) {
    props.renderWidget({
      light: (
        <MiniCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
        />
      ),

      dark: (
        <MiniCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
        />
      ),
    });

    return;
  }

  /*
   * Default 4x2 widget.
   */
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
}

function renderMessage(
  props: WidgetTaskHandlerProps,
  widgetSize: WidgetSize,
  city: City | null,
  message: string
) {
  try {
    if (
      widgetSize ===
      'compact'
    ) {
      props.renderWidget({
        light: (
          <CompactCurrentWeatherWidget
            theme="light"
            city={city}
            weather={null}
            message={message}
          />
        ),

        dark: (
          <CompactCurrentWeatherWidget
            theme="dark"
            city={city}
            weather={null}
            message={message}
          />
        ),
      });

      return;
    }

    if (
      widgetSize ===
      'vertical'
    ) {
      props.renderWidget({
        light: (
          <VerticalCurrentWeatherWidget
            theme="light"
            city={city}
            weather={null}
            message={message}
          />
        ),

        dark: (
          <VerticalCurrentWeatherWidget
            theme="dark"
            city={city}
            weather={null}
            message={message}
          />
        ),
      });

      return;
    }

    if (
      widgetSize ===
      'square'
    ) {
      props.renderWidget({
        light: (
          <SquareCurrentWeatherWidget
            theme="light"
            city={city}
            weather={null}
            message={message}
          />
        ),

        dark: (
          <SquareCurrentWeatherWidget
            theme="dark"
            city={city}
            weather={null}
            message={message}
          />
        ),
      });

      return;
    }

    if (
      widgetSize ===
      'mini'
    ) {
      props.renderWidget({
        light: (
          <MiniCurrentWeatherWidget
            theme="light"
            city={city}
            weather={null}
            message={message}
          />
        ),

        dark: (
          <MiniCurrentWeatherWidget
            theme="dark"
            city={city}
            weather={null}
            message={message}
          />
        ),
      });

      return;
    }

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