import {
  useEffect,
  useState,
} from 'react';

import type { City } from '../../city-search/model/city';

import { getWeather } from '../api/getWeather';
import type { Weather } from '../model/weather';

import { WeatherCard } from './WeatherCard';

type WeatherPageProps = {
  city: City;

  isCurrentLocation: boolean;

  isFavorite: boolean;

  onToggleFavorite: (
    city: City
  ) => void;
};

export function WeatherPage({
  city,
  isCurrentLocation,
  isFavorite,
  onToggleFavorite,
}: WeatherPageProps) {
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
          `Wetter für ${city.name} konnte nicht geladen werden:`,
          error
        );

        if (!isMounted) {
          return;
        }

        setError(
          'Das Wetter konnte nicht geladen werden.'
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

  return (
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
}