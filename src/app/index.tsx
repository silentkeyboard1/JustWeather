import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { searchCities } from '../features/city-search/api/searchCities';
import { CitySearchForm } from '../features/city-search/components/CitySearchForm';
import { CitySearchResults } from '../features/city-search/components/CitySearchResults';
import type { City } from '../features/city-search/model/city';

import { getWeather } from '../features/weather/api/getWeather';
import { WeatherCard } from '../features/weather/components/WeatherCard';
import type { Weather } from '../features/weather/model/weather';

export default function HomeScreen() {
  const [city, setCity] = useState('');

  const [cities, setCities] =
    useState<City[]>([]);

  const [selectedCity, setSelectedCity] =
    useState<City | null>(null);

  const [weather, setWeather] =
    useState<Weather | null>(null);

  const [isSearching, setIsSearching] =
    useState(false);

  const [
    isLoadingWeather,
    setIsLoadingWeather,
  ] = useState(false);

  const [searchError, setSearchError] =
    useState<string | null>(null);

  const [weatherError, setWeatherError] =
    useState<string | null>(null);

  async function handleSearch() {
    const trimmedCity = city.trim();

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
        await searchCities(trimmedCity);

      setCities(foundCities);

      if (foundCities.length === 0) {
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

  async function handleCitySelect(
    selectedCity: City
  ) {
    setSelectedCity(selectedCity);

    setCities([]);
    setWeather(null);
    setWeatherError(null);

    setIsLoadingWeather(true);

    try {
      const loadedWeather =
        await getWeather(selectedCity);

      setWeather(loadedWeather);
    } catch (error) {
      console.error(
        'Fehler beim Laden des Wetters:',
        error
      );

      setWeatherError(
        'Das Wetter konnte nicht geladen werden.'
      );
    } finally {
      setIsLoadingWeather(false);
    }
  }

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
        <Text style={styles.errorText}>
          {searchError}
        </Text>
      )}

      <CitySearchResults
        cities={cities}
        onCitySelect={handleCitySelect}
      />

      {selectedCity && (
        <WeatherCard
          city={selectedCity}
          weather={weather}
          isLoading={isLoadingWeather}
          error={weatherError}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  errorText: {
    marginTop: 12,
    color: '#b00020',
  },
});