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
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      await renderLiveWeather(
        props,
        widgetSize
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
          widgetSize
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
  widgetSize: WidgetSize
) {
  let city:
    | City
    | null;

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
      widgetSize,
      null,
      'Widget location could not be determined.'
    );

    return;
  }

  if (!city) {
    renderMessage(
      props,
      widgetSize,
      null,
      'Open JustWeather once to set your location.'
    );

    return;
  }

  try {
    const weather =
      await getWeather(
        city
      );

    renderWeather(
      props,
      widgetSize,
      city,
      weather
    );
  } catch (error) {
    console.error(
      'Widget weather update failed:',
      error
    );

    renderMessage(
      props,
      widgetSize,
      city,
      'Weather unavailable. Tap refresh to try again.'
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