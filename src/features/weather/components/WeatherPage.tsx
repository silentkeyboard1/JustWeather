import {
  useCallback,
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

  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadWeather =
    useCallback(
      async (
        showInitialLoader = false
      ) => {
        if (showInitialLoader) {
          setIsLoading(true);
        }

        setError(null);

        try {
          const loadedWeather =
            await getWeather(city);

          setWeather(
            loadedWeather
          );
        } catch (error) {
          console.error(
            `Failed to load weather for ${city.name}:`,
            error
          );

          setError(
            'Weather data could not be loaded.'
          );
        } finally {
          if (showInitialLoader) {
            setIsLoading(false);
          }
        }
      },
      [
        city.id,
        city.latitude,
        city.longitude,
        city.name,
      ]
    );

  useEffect(() => {
    void loadWeather(true);
  }, [loadWeather]);

  async function handleRefresh() {
    setIsRefreshing(true);

    try {
      await loadWeather(false);
    } finally {
      setIsRefreshing(false);
    }
  }

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
      isRefreshing={
        isRefreshing
      }
      error={error}
      showFavoriteButton={
        !isCurrentLocation
      }
      isFavorite={isFavorite}
      onToggleFavorite={() =>
        onToggleFavorite(city)
      }
      onRefresh={
        handleRefresh
      }

      // Home = full-screen layout.
      fullScreen={
        useWeatherBackground
      }
    />
  );

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
        0.5,
      ]}
      start={{
        x: 0,
        y: 0,
      }}
      end={{
        x: 1,
        y: 0.7,
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