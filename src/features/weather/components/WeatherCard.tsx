import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  CalendarDays,
  CloudRain,
  Clock,
  Droplets,
  Star,
  Thermometer,
  Wind,
} from 'lucide-react-native';

import type { City } from '../../city-search/model/city';

import type { Weather } from '../model/weather';

import {
  AppColors,
  useAppTheme,
} from '../../../shared/theme/theme';

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
  const { height } =
    useWindowDimensions();

  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  return (
    <ScrollView
      style={[
        styles.card,

        {
          maxHeight:
            height * 0.65,
        },
      ]}
      contentContainerStyle={
        styles.cardContent
      }
      showsVerticalScrollIndicator={
        false
      }
      nestedScrollEnabled
    >
      <View style={styles.header}>
        <View style={styles.cityInfo}>
          <Text style={styles.city}>
            {city.name}
          </Text>

          <Text
            style={styles.country}
          >
            {city.region
              ? `${city.region}, `
              : ''}

            {city.country}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.favoriteButton,

            pressed && {
              opacity: 0.6,
            },
          ]}
          onPress={onToggleFavorite}
          hitSlop={8}
        >
          <Star
            size={30}
            color={
              isFavorite
                ? colors.favorite
                : colors.icon
            }
            fill={
              isFavorite
                ? colors.favorite
                : 'transparent'
            }
          />
        </Pressable>
      </View>

      {isLoading && (
        <View
          style={styles.loading}
        >
          <ActivityIndicator
            color={colors.primary}
          />

          <Text
            style={styles.mutedText}
          >
            Wetter wird geladen...
          </Text>
        </View>
      )}

      {error && (
        <Text
          style={styles.errorText}
        >
          {error}
        </Text>
      )}

      {weather && (
        <>
          <View
            style={
              styles.currentWeather
            }
          >
            <Text
              style={
                styles.temperature
              }
            >
              {Math.round(
                weather.current
                  .temperature
              )}{' '}
              °C
            </Text>

            <View
              style={
                styles.weatherInfoRow
              }
            >
              <Thermometer
                size={18}
                color={colors.icon}
              />

              <Text
                style={
                  styles.infoText
                }
              >
                Gefühlt:{' '}
                {Math.round(
                  weather.current
                    .apparentTemperature
                )}{' '}
                °C
              </Text>
            </View>

            <View
              style={
                styles.weatherInfoRow
              }
            >
              <Droplets
                size={18}
                color={colors.icon}
              />

              <Text
                style={
                  styles.infoText
                }
              >
                Luftfeuchtigkeit:{' '}
                {
                  weather.current
                    .humidity
                }{' '}
                %
              </Text>
            </View>

            <View
              style={
                styles.weatherInfoRow
              }
            >
              <Wind
                size={18}
                color={colors.icon}
              />

              <Text
                style={
                  styles.infoText
                }
              >
                Wind:{' '}
                {
                  weather.current
                    .windSpeed
                }{' '}
                km/h
              </Text>
            </View>
          </View>

          <View
            style={styles.section}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <Clock
                size={20}
                color={colors.icon}
              />

              <Text
                style={
                  styles.sectionTitle
                }
              >
                Stündliche Vorhersage
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              nestedScrollEnabled
            >
              <View
                style={
                  styles.hourlyList
                }
              >
                {weather.hourly.map(
                  (hour) => (
                    <View
                      key={hour.time}
                      style={
                        styles.hourlyItem
                      }
                    >
                      <Text
                        style={
                          styles.hourlyTime
                        }
                      >
                        {hour.time.slice(
                          11,
                          16
                        )}
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

                      <View
                        style={
                          styles.rainRow
                        }
                      >
                        <CloudRain
                          size={15}
                          color={
                            colors.primary
                          }
                        />

                        <Text
                          style={
                            styles.rain
                          }
                        >
                          {
                            hour.precipitationProbability
                          }
                          %
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </ScrollView>
          </View>

          <View
            style={styles.section}
          >
            <View
              style={
                styles.sectionHeader
              }
            >
              <CalendarDays
                size={20}
                color={colors.icon}
              />

              <Text
                style={
                  styles.sectionTitle
                }
              >
                7-Tage-Vorhersage
              </Text>
            </View>

            <View
              style={styles.dailyList}
            >
              {weather.daily.map(
                (day) => (
                  <View
                    key={day.date}
                    style={
                      styles.dailyItem
                    }
                  >
                    <Text
                      style={
                        styles.dailyDate
                      }
                    >
                      {formatDate(
                        day.date
                      )}
                    </Text>

                    <View
                      style={
                        styles.dailyRain
                      }
                    >
                      <CloudRain
                        size={16}
                        color={
                          colors.primary
                        }
                      />

                      <Text
                        style={
                          styles.infoText
                        }
                      >
                        {
                          day.precipitationProbability
                        }
                        %
                      </Text>
                    </View>

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
                )
              )}
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
}

function formatDate(
  date: string
) {
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

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    card: {
      marginTop: 24,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surface,

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

      color: colors.text,
    },

    country: {
      fontSize: 16,

      marginBottom: 20,

      color: colors.textMuted,
    },

    favoriteButton: {
      padding: 8,
    },

    currentWeather: {
      gap: 10,
    },

    temperature: {
      fontSize: 36,

      fontWeight: 'bold',

      marginBottom: 8,

      color: colors.text,
    },

    weatherInfoRow: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 8,
    },

    infoText: {
      color: colors.text,
    },

    mutedText: {
      color: colors.textMuted,
    },

    loading: {
      gap: 8,

      alignItems: 'center',

      paddingVertical: 16,
    },

    errorText: {
      color: colors.error,
    },

    section: {
      marginTop: 28,
    },

    sectionHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 8,

      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,

      fontWeight: 'bold',

      color: colors.text,
    },

    hourlyList: {
      flexDirection: 'row',

      gap: 12,
    },

    hourlyItem: {
      minWidth: 80,

      padding: 12,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surfaceSecondary,

      borderRadius: 8,

      alignItems: 'center',

      gap: 8,
    },

    hourlyTime: {
      fontSize: 14,

      color: colors.textMuted,
    },

    hourlyTemperature: {
      fontSize: 22,

      fontWeight: 'bold',

      color: colors.text,
    },

    rainRow: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 4,
    },

    rain: {
      fontSize: 12,

      color: colors.textMuted,
    },

    dailyList: {
      gap: 8,
    },

    dailyItem: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingVertical: 12,

      borderBottomWidth: 1,

      borderBottomColor:
        colors.border,
    },

    dailyDate: {
      flex: 1,

      fontWeight: '600',

      color: colors.text,
    },

    dailyRain: {
      width: 80,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 5,
    },

    dailyTemperatures: {
      width: 80,

      flexDirection: 'row',

      justifyContent: 'flex-end',

      gap: 10,
    },

    temperatureMax: {
      fontWeight: 'bold',

      color: colors.text,
    },

    temperatureMin: {
      color: colors.textMuted,
    },
  });
}