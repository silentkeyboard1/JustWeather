import type {
  City,
} from '../city-search/model/city';

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

export type WidgetSize =
  | 'large'
  | 'compact'
  | 'vertical'
  | 'square'
  | 'mini';

export function getWidgetSize(
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

export function createWeatherWidgetRepresentation(
  widgetSize: WidgetSize,
  city: City | null,
  weather: Weather | null,
  message?: string
) {
  if (
    widgetSize ===
    'compact'
  ) {
    return {
      light: (
        <CompactCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
          message={message}
        />
      ),

      dark: (
        <CompactCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
          message={message}
        />
      ),
    };
  }

  if (
    widgetSize ===
    'vertical'
  ) {
    return {
      light: (
        <VerticalCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
          message={message}
        />
      ),

      dark: (
        <VerticalCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
          message={message}
        />
      ),
    };
  }

  if (
    widgetSize ===
    'square'
  ) {
    return {
      light: (
        <SquareCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
          message={message}
        />
      ),

      dark: (
        <SquareCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
          message={message}
        />
      ),
    };
  }

  if (
    widgetSize ===
    'mini'
  ) {
    return {
      light: (
        <MiniCurrentWeatherWidget
          theme="light"
          city={city}
          weather={weather}
          message={message}
        />
      ),

      dark: (
        <MiniCurrentWeatherWidget
          theme="dark"
          city={city}
          weather={weather}
          message={message}
        />
      ),
    };
  }

  return {
    light: (
      <CurrentWeatherWidget
        theme="light"
        city={city}
        weather={weather}
        message={message}
      />
    ),

    dark: (
      <CurrentWeatherWidget
        theme="dark"
        city={city}
        weather={weather}
        message={message}
      />
    ),
  };
}