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

  icon: WeatherIconName;
};

export function getWeatherCondition(
  weatherCode: number,
  isDay = true
): WeatherCondition {
  /**
   * Clear sky
   */
  if (weatherCode === 0) {
    return {
      type: 'clear',

      label: 'Clear sky',

      color: isDay
        ? weatherPalette.sun
        : weatherPalette.clearSky,

      icon: isDay
        ? 'sun'
        : 'moon',
    };
  }

  /**
   * Mainly clear
   */
  if (weatherCode === 1) {
    return {
      type: 'partly-cloudy',

      label: 'Mainly clear',

      color:
        weatherPalette.clearSky,

      icon: isDay
        ? 'cloud-sun'
        : 'cloud-moon',
    };
  }

  /**
   * Partly cloudy
   */
  if (weatherCode === 2) {
    return {
      type: 'partly-cloudy',

      label: 'Partly cloudy',

      color:
        weatherPalette.clearSky,

      icon: isDay
        ? 'cloud-sun'
        : 'cloud-moon',
    };
  }

  /**
   * Overcast
   */
  if (weatherCode === 3) {
    return {
      type: 'cloudy',

      label: 'Overcast',

      color:
        weatherPalette.cloudy,

      icon: 'cloud',
    };
  }

  /**
   * Fog
   */
  if (
    weatherCode === 45 ||
    weatherCode === 48
  ) {
    return {
      type: 'fog',

      label: 'Fog',

      color:
        weatherPalette.cloudy,

      icon: 'cloud-fog',
    };
  }

  /**
   * Drizzle / freezing drizzle
   */
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

      icon: 'cloud-drizzle',
    };
  }

  /**
   * Rain / freezing rain
   */
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

      icon: 'cloud-rain',
    };
  }

  /**
   * Snow
   */
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

      icon: 'snowflake',
    };
  }

  /**
   * Rain showers
   */
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

      icon: 'cloud-rain',
    };
  }

  /**
   * Snow showers
   */
  if (
    weatherCode === 85 ||
    weatherCode === 86
  ) {
    return {
      type: 'snow',

      label: 'Snow showers',

      color:
        weatherPalette.clearSky,

      icon: 'snowflake',
    };
  }

  /**
   * Thunderstorm
   */
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

      icon: 'cloud-lightning',
    };
  }

  /**
   * Safe fallback in case the API
   * ever returns a code we do not know.
   */
  return {
    type: 'unknown',

    label: 'Unknown',

    color:
      weatherPalette.cloudy,

    icon: 'cloud',
  };
}