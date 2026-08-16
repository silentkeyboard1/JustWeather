import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import type { City } from '../../city-search/model/city';
import type { Weather } from '../model/weather';

type WeatherCardProps = {
  city: City;
  weather: Weather | null;
  isLoading: boolean;
  error: string | null;

  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function WeatherCard({
  city,
  weather,
  isLoading,
  error,
  isFavorite,
  onToggleFavorite,
}: WeatherCardProps) {
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      style={[
        styles.card,
        {
          maxHeight: height * 0.65,
        },
      ]}
      contentContainerStyle={styles.cardContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <View style={styles.header}>
        <View style={styles.cityInfo}>
          <Text style={styles.city}>
            {city.name}
          </Text>

          <Text style={styles.country}>
            {city.region
              ? `${city.region}, `
              : ''}

            {city.country}
          </Text>
        </View>

        <Pressable
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Text style={styles.favoriteIcon}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </Pressable>
      </View>

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
        <>
          <View style={styles.currentWeather}>
            <Text style={styles.temperature}>
              {Math.round(
                weather.current.temperature
              )}{' '}
              °C
            </Text>

            <Text>
              Gefühlt:{' '}
              {Math.round(
                weather.current.apparentTemperature
              )}{' '}
              °C
            </Text>

            <Text>
              Luftfeuchtigkeit:{' '}
              {weather.current.humidity} %
            </Text>

            <Text>
              Wind:{' '}
              {weather.current.windSpeed} km/h
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Stündliche Vorhersage
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
            >
              <View style={styles.hourlyList}>
                {weather.hourly.map((hour) => (
                  <View
                    key={hour.time}
                    style={styles.hourlyItem}
                  >
                    <Text style={styles.hourlyTime}>
                      {hour.time.slice(11, 16)}
                    </Text>

                    <Text
                      style={
                        styles.hourlyTemperature
                      }
                    >
                      {Math.round(
                        hour.temperature
                      )}
                      °
                    </Text>

                    <Text style={styles.rain}>
                      💧{' '}
                      {
                        hour.precipitationProbability
                      }{' '}
                      %
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              7-Tage-Vorhersage
            </Text>

            <View style={styles.dailyList}>
              {weather.daily.map((day) => (
                <View
                  key={day.date}
                  style={styles.dailyItem}
                >
                  <Text style={styles.dailyDate}>
                    {formatDate(day.date)}
                  </Text>

                  <Text style={styles.dailyRain}>
                    💧{' '}
                    {
                      day.precipitationProbability
                    }{' '}
                    %
                  </Text>

                  <View
                    style={
                      styles.dailyTemperatures
                    }
                  >
                    <Text
                      style={
                        styles.temperatureMax
                      }
                    >
                      {Math.round(
                        day.temperatureMax
                      )}
                      °
                    </Text>

                    <Text
                      style={
                        styles.temperatureMin
                      }
                    >
                      {Math.round(
                        day.temperatureMin
                      )}
                      °
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function formatDate(date: string) {
  const parsedDate = new Date(
    `${date}T12:00:00`
  );

  return parsedDate.toLocaleDateString(
    'de-DE',
    {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },

  cardContent: {
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  cityInfo: {
    flex: 1,
  },

  city: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  country: {
    fontSize: 16,
    marginBottom: 20,
  },

  favoriteButton: {
    padding: 8,
  },

  favoriteIcon: {
    fontSize: 32,
  },

  currentWeather: {
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

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  hourlyList: {
    flexDirection: 'row',
    gap: 12,
  },

  hourlyItem: {
    minWidth: 80,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
  },

  hourlyTime: {
    fontSize: 14,
  },

  hourlyTemperature: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  rain: {
    fontSize: 12,
  },

  dailyList: {
    gap: 8,
  },

  dailyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dailyDate: {
    flex: 1,
    fontWeight: '600',
  },

  dailyRain: {
    width: 80,
  },

  dailyTemperatures: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },

  temperatureMax: {
    fontWeight: 'bold',
  },

  temperatureMin: {
    color: '#777',
  },
});