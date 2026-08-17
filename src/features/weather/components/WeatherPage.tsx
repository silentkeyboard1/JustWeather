import {
  useEffect,
  useState,
} from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  LinearGradient,
} from 'expo-linear-gradient';

import type { City } from '../../city-search/model/city';

import { useAppTheme } from '../../../shared/theme/theme';

import { getWeather } from '../api/getWeather';

import { getWeatherCondition } from '../utils/getWeatherCondition';

import type { Weather } from '../model/weather';

import { WeatherCard } from './WeatherCard';

type WeatherPageProps = {
  city: City;

  isCurrentLocation: boolean;

  isFavorite: boolean;

  onToggleFavorite: (
    city: City
  ) => void;

  useWeatherBackground?: boolean;
};

export function WeatherPage({
  city,
  isCurrentLocation,
  isFavorite,
  onToggleFavorite,
  useWeatherBackground = false,
}: WeatherPageProps) {
  const { colors } =
    useAppTheme();

  const [weather, setWeather] =
    useState<Weather | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [error, setError] =
    useState<string | null>(
      null
    );

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      setIsLoading(true);

      setError(null);

      try {
        const loadedWeather =
          await getWeather(city);

        if (!isMounted) {
          return;
        }

        setWeather(
          loadedWeather
        );
      } catch (error) {
        console.error(
          `Failed to load weather for ${city.name}:`,
          error
        );

        if (!isMounted) {
          return;
        }

        setError(
          'Weather data could not be loaded.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadWeather();

    return () => {
      isMounted = false;
    };
  }, [
    city.id,
    city.latitude,
    city.longitude,
    city.name,
  ]);

  const condition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  const content = (
    <WeatherCard
      city={city}
      weather={weather}
      isLoading={isLoading}
      error={error}
      showFavoriteButton={
        !isCurrentLocation
      }
      isFavorite={isFavorite}
      onToggleFavorite={() =>
        onToggleFavorite(city)
      }
    />
  );

  /**
   * Search results can still use the
   * normal background.
   *
   * On Home we enable the reactive
   * weather gradient.
   */
  if (!useWeatherBackground) {
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
  }

  const weatherColor =
    condition?.color ??
    colors.background;

  return (
    <LinearGradient
      colors={[
        weatherColor,
        colors.background,
      ]}
      locations={[
        0,
        0.78,
      ]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 1,
        y: 1,
      }}
      style={styles.container}
    >
      {content}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});