import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { City } from '../../city-search/model/city';
import type { CurrentWeather } from '../model/weather';

type WeatherCardProps = {
  city: City;
  weather: CurrentWeather | null;
  isLoading: boolean;
  error: string | null;
};

export function WeatherCard({
  city,
  weather,
  isLoading,
  error,
}: WeatherCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.city}>
        {city.name}
      </Text>

      <Text style={styles.country}>
        {city.region
          ? `${city.region}, `
          : ''}
        {city.country}
      </Text>

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />

          <Text>
            Wetter wird geladen...
          </Text>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>
          {error}
        </Text>
      )}

      {weather && (
        <View style={styles.details}>
          <Text style={styles.temperature}>
            {weather.temperature} °C
          </Text>

          <Text>
            Gefühlt: {weather.apparentTemperature} °C
          </Text>

          <Text>
            Luftfeuchtigkeit: {weather.humidity} %
          </Text>

          <Text>
            Wind: {weather.windSpeed} km/h
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },

  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  country: {
    fontSize: 16,
    marginBottom: 20,
  },

  details: {
    gap: 8,
  },

  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  loading: {
    gap: 8,
    alignItems: 'center',
    paddingVertical: 16,
  },

  errorText: {
    color: '#b00020',
  },
});