import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { searchCities } from '../features/city-search/api/searchCities';
import { CitySearchForm } from '../features/city-search/components/CitySearchForm';
import type { City } from '../features/city-search/model/city';

import { getCurrentWeather } from '../features/weather/api/getCurrentWeather';
import type { CurrentWeather } from '../features/weather/model/weather';

export default function HomeScreen() {
  const [city, setCity] = useState('');

  const [cities, setCities] =
    useState<City[]>([]);

  const [selectedCity, setSelectedCity] =
    useState<City | null>(null);

  const [weather, setWeather] =
    useState<CurrentWeather | null>(null);

  async function handleSearch() {
    try {
      const foundCities =
        await searchCities(city);

      setCities(foundCities);

      setSelectedCity(null);
      setWeather(null);
    } catch (error) {
      console.error(
        'Fehler bei der Stadtsuche:',
        error
      );
    }
  }

  async function handleCitySelect(
    selectedCity: City
  ) {
    setSelectedCity(selectedCity);

    // Andere Suchergebnisse ausblenden
    setCities([]);

    try {
      const currentWeather =
        await getCurrentWeather(selectedCity);

      setWeather(currentWeather);
    } catch (error) {
      console.error(
        'Fehler beim Laden des Wetters:',
        error
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        JustWeather
      </Text>

      <CitySearchForm
        city={city}
        onCityChange={setCity}
        onSearch={handleSearch}
      />

      <View style={styles.results}>
        {cities.map((cityResult) => (
          <Pressable
            key={cityResult.id}
            style={styles.resultItem}
            onPress={() =>
              handleCitySelect(cityResult)
            }
          >
            <Text style={styles.resultName}>
              {cityResult.name}
            </Text>

            <Text>
              {cityResult.region
                ? `${cityResult.region}, `
                : ''}

              {cityResult.country}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedCity && (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherCity}>
            {selectedCity.name}
          </Text>

          <Text style={styles.weatherCountry}>
            {selectedCity.country}
          </Text>

          {weather && (
            <View style={styles.weatherDetails}>
              <Text style={styles.temperature}>
                {weather.temperature} °C
              </Text>

              <Text>
                Gefühlt:{' '}
                {weather.apparentTemperature} °C
              </Text>

              <Text>
                Luftfeuchtigkeit:{' '}
                {weather.humidity} %
              </Text>

              <Text>
                Wind: {weather.windSpeed} km/h
              </Text>
            </View>
          )}
        </View>
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

  results: {
    marginTop: 24,
    gap: 12,
  },

  resultItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },

  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  weatherCard: {
    marginTop: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },

  weatherCity: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  weatherCountry: {
    fontSize: 16,
    marginBottom: 20,
  },

  weatherDetails: {
    gap: 8,
  },

  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});