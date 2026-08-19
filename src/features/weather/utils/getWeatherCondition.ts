import { weatherPalette } from '../constants/weatherPalette';

export type WeatherConditionType =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown';

export type WeatherIconName =
  | 'sun'
  | 'moon'
  | 'cloud-sun'
  | 'cloud-moon'
  | 'cloud'
  | 'cloud-fog'
  | 'cloud-drizzle'
  | 'cloud-rain'
  | 'snowflake'
  | 'cloud-lightning';

export type WeatherCondition = {
  type: WeatherConditionType;
  label: string;

  color: string;

  /**
   * Text/icon color that has enough
   * contrast against the weather color.
   */
  foregroundColor: string;

  icon: WeatherIconName;
};

export function getWeatherCondition(
  weatherCode: number,
  isDay = true
): WeatherCondition {
  if (weatherCode === 0) {
    return {
      type: 'clear',
      label: 'Clear sky',

      color: isDay
        ? weatherPalette.sun
        : weatherPalette.clearSky,

      foregroundColor:
        weatherPalette.dark,

      icon: isDay
        ? 'sun'
        : 'moon',
    };
  }

  if (weatherCode === 1) {
    return {
      type: 'partly-cloudy',
      label: 'Mainly clear',

      color:
        weatherPalette.clearSky,

      foregroundColor:
        weatherPalette.dark,

      icon: isDay
        ? 'cloud-sun'
        : 'cloud-moon',
    };
  }

  if (weatherCode === 2) {
    return {
      type: 'partly-cloudy',
      label: 'Partly cloudy',

      color:
        weatherPalette.clearSky,

      foregroundColor:
        weatherPalette.dark,

      icon: isDay
        ? 'cloud-sun'
        : 'cloud-moon',
    };
  }

  if (weatherCode === 3) {
    return {
      type: 'cloudy',
      label: 'Overcast',

      color:
        weatherPalette.cloudy,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud',
    };
  }

  if (
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return {
      type: 'fog',
      label: 'Fog',

      color:
        weatherPalette.cloudy,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud-fog',
    };
  }

  if (
    [
      51,
      53,
      55,
      56,
      57,
    ].includes(weatherCode)
  ) {
    return {
      type: 'drizzle',
      label: 'Drizzle',

      color:
        weatherPalette.rain,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud-drizzle',
    };
  }

  if (
    [
      61,
      63,
      65,
      66,
      67,
    ].includes(weatherCode)
  ) {
    return {
      type: 'rain',
      label: 'Rain',

      color:
        weatherPalette.rain,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud-rain',
    };
  }

  if (
    [
      71,
      73,
      75,
      77,
    ].includes(weatherCode)
  ) {
    return {
      type: 'snow',
      label: 'Snow',

      color:
        weatherPalette.clearSky,

      foregroundColor:
        weatherPalette.dark,

      icon: 'snowflake',
    };
  }

  if (
    [
      80,
      81,
      82,
    ].includes(weatherCode)
  ) {
    return {
      type: 'rain',
      label: 'Rain showers',

      color:
        weatherPalette.rain,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud-rain',
    };
  }

  if (
    weatherCode === 85 ||
    weatherCode === 86
  ) {
    return {
      type: 'snow',
      label: 'Snow showers',

      color:
        weatherPalette.clearSky,

      foregroundColor:
        weatherPalette.dark,

      icon: 'snowflake',
    };
  }

  if (
    weatherCode === 95 ||
    weatherCode === 96 ||
    weatherCode === 99
  ) {
    return {
      type: 'thunderstorm',
      label: 'Thunderstorm',

      color:
        weatherPalette.rain,

      foregroundColor:
        weatherPalette.light,

      icon: 'cloud-lightning',
    };
  }

  return {
    type: 'unknown',
    label: 'Unknown',

    color:
      weatherPalette.cloudy,

    foregroundColor:
      weatherPalette.light,

    icon: 'cloud',
  };
}