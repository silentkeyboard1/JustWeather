import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import type {
  City,
} from '../../city-search/model/city';

import {
  getWeather,
} from '../api/getWeather';

import type {
  Weather,
} from '../model/weather';

import {
  WeatherCard,
} from './WeatherCard';

import {
  useAppTheme,
} from '../../../shared/theme/theme';

type WeatherPageProps = {
  city: City;

  isCurrentLocation: boolean;

  isFavorite: boolean;

  onToggleFavorite?: (
    city: City
  ) => void | Promise<void>;

  /*
   * We keep this prop so index.tsx and
   * search.tsx do not need to change.
   *
   * It no longer enables a gradient.
   * It only tells WeatherCard that this
   * page fills the complete screen.
   */
  useWeatherBackground?: boolean;
};

export function WeatherPage({
  city,
  isCurrentLocation,
  isFavorite,
  onToggleFavorite,
  useWeatherBackground = false,
}: WeatherPageProps) {
  const {
    colors,
  } = useAppTheme();

  const [
    weather,
    setWeather,
  ] =
    useState<Weather | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true);

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const loadWeather =
    useCallback(
      async (
        refreshing = false
      ) => {
        if (refreshing) {
          setIsRefreshing(
            true
          );
        } else {
          setIsLoading(
            true
          );
        }

        setError(
          null
        );

        try {
          const weatherData =
            await getWeather(
              city
            );

          setWeather(
            weatherData
          );
        } catch (error) {
          console.error(
            'Failed to load weather:',
            error
          );

          setError(
            'Weather data could not be loaded.'
          );
        } finally {
          setIsLoading(
            false
          );

          setIsRefreshing(
            false
          );
        }
      },
      [
        city,
      ]
    );

  useEffect(() => {
    void loadWeather();
  }, [
    loadWeather,
  ]);

  function handleRefresh() {
    void loadWeather(
      true
    );
  }

  function handleToggleFavorite() {
    if (
      !onToggleFavorite
    ) {
      return;
    }

    void onToggleFavorite(
      city
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <WeatherCard
        city={
          city
        }
        weather={
          weather
        }
        isLoading={
          isLoading
        }
        isRefreshing={
          isRefreshing
        }
        error={
          error
        }
        showFavoriteButton={
          !isCurrentLocation
        }
        isFavorite={
          isFavorite
        }
        onToggleFavorite={
          handleToggleFavorite
        }
        onRefresh={
          handleRefresh
        }
        fullScreen={
          useWeatherBackground
        }
      />
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });