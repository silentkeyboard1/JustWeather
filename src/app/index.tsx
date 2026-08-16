import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { searchCities } from '../features/city-search/api/searchCities';

import { CitySearchForm } from '../features/city-search/components/CitySearchForm';

import { CitySearchResults } from '../features/city-search/components/CitySearchResults';

import type { City } from '../features/city-search/model/city';

import { useFavorites } from '../features/favorites/context/FavoritesContext';

import { getWeather } from '../features/weather/api/getWeather';

import { WeatherCard } from '../features/weather/components/WeatherCard';

import type { Weather } from '../features/weather/model/weather';

import {
  AppColors,
  useAppTheme,
} from '../shared/theme/theme';

export default function HomeScreen() {
  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  const { cityId } =
    useLocalSearchParams<{
      cityId?: string;
    }>();

  const [city, setCity] =
    useState('');

  const [cities, setCities] =
    useState<City[]>([]);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState<City | null>(
    null
  );

  const [weather, setWeather] =
    useState<Weather | null>(
      null
    );

  const [
    isSearching,
    setIsSearching,
  ] = useState(false);

  const [
    isLoadingWeather,
    setIsLoadingWeather,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState<
    string | null
  >(null);

  const [
    weatherError,
    setWeatherError,
  ] = useState<
    string | null
  >(null);

  const {
    favoriteCities,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const loadWeatherForCity =
    useCallback(
      async (
        selectedCity: City
      ) => {
        setSelectedCity(
          selectedCity
        );

        setCities([]);

        setWeather(null);

        setWeatherError(null);

        setIsLoadingWeather(
          true
        );

        try {
          const loadedWeather =
            await getWeather(
              selectedCity
            );

          setWeather(
            loadedWeather
          );
        } catch (error) {
          console.error(
            'Fehler beim Laden des Wetters:',
            error
          );

          setWeatherError(
            'Das Wetter konnte nicht geladen werden.'
          );
        } finally {
          setIsLoadingWeather(
            false
          );
        }
      },
      []
    );

  useEffect(() => {
    if (!cityId) {
      return;
    }

    const favoriteCity =
      favoriteCities.find(
        (city) =>
          city.id === cityId
      );

    if (!favoriteCity) {
      return;
    }

    void loadWeatherForCity(
      favoriteCity
    );

    router.setParams({
      cityId: '',
    });
  }, [
    cityId,
    favoriteCities,
    loadWeatherForCity,
  ]);

  async function handleSearch() {
    const trimmedCity =
      city.trim();

    if (!trimmedCity) {
      setSearchError(
        'Bitte gib eine Stadt ein.'
      );

      return;
    }

    setIsSearching(true);

    setSearchError(null);

    setWeatherError(null);

    setSelectedCity(null);

    setWeather(null);

    try {
      const foundCities =
        await searchCities(
          trimmedCity
        );

      setCities(
        foundCities
      );

      if (
        foundCities.length === 0
      ) {
        setSearchError(
          'Keine passende Stadt gefunden.'
        );
      }
    } catch (error) {
      console.error(
        'Fehler bei der Stadtsuche:',
        error
      );

      setCities([]);

      setSearchError(
        'Die Stadtsuche ist fehlgeschlagen. Bitte versuche es erneut.'
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleCitySelect(
    selectedCity: City
  ) {
    void loadWeatherForCity(
      selectedCity
    );
  }

  function handleToggleFavorite() {
    if (!selectedCity) {
      return;
    }

    void toggleFavorite(
      selectedCity
    );
  }

  const isSelectedCityFavorite =
    selectedCity
      ? isFavorite(
          selectedCity.id
        )
      : false;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        JustWeather
      </Text>

      <CitySearchForm
        city={city}
        isLoading={isSearching}
        onCityChange={setCity}
        onSearch={handleSearch}
      />

      {searchError && (
        <Text
          style={
            styles.errorText
          }
        >
          {searchError}
        </Text>
      )}

      <CitySearchResults
        cities={cities}
        onCitySelect={
          handleCitySelect
        }
      />

      {selectedCity && (
        <WeatherCard
          city={selectedCity}
          weather={weather}
          isLoading={
            isLoadingWeather
          }
          error={weatherError}
          isFavorite={
            isSelectedCityFavorite
          }
          onToggleFavorite={
            handleToggleFavorite
          }
        />
      )}
    </View>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    container: {
      flex: 1,

      padding: 24,

      justifyContent:
        'center',

      backgroundColor:
        colors.background,
    },

    title: {
      fontSize: 32,

      fontWeight: 'bold',

      marginBottom: 8,

      color: colors.text,
    },

    errorText: {
      marginTop: 12,

      color: colors.error,
    },
  });
}