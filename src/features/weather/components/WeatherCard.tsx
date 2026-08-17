import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Droplets,
  Star,
  Thermometer,
  Wind,
} from 'lucide-react-native';

import type { City } from '../../city-search/model/city';

import type { Weather } from '../model/weather';

import {
  getWeatherCondition,
} from '../utils/getWeatherCondition';

import { WeatherIcon } from './WeatherIcon';

import {
  AppColors,
  useAppTheme,
} from '../../../shared/theme/theme';

type WeatherCardProps = {
  city: City;

  weather: Weather | null;

  isLoading: boolean;

  isRefreshing: boolean;

  error: string | null;

  showFavoriteButton?: boolean;

  isFavorite?: boolean;

  onToggleFavorite?: () => void;

  onRefresh: () => void;
};

export function WeatherCard({
  city,
  weather,
  isLoading,
  isRefreshing,
  error,
  showFavoriteButton = true,
  isFavorite = false,
  onToggleFavorite,
  onRefresh,
}: WeatherCardProps) {
  const { width } =
    useWindowDimensions();

  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  const foregroundColor =
    currentCondition
      ?.foregroundColor ??
    colors.text;

  const temperatureSize =
    Math.min(
      width * 0.4,
      150
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.content
      }
      showsVerticalScrollIndicator={
        false
      }
      refreshControl={
        <RefreshControl
          refreshing={
            isRefreshing
          }
          onRefresh={onRefresh}
          colors={[
            colors.primary,
          ]}
          tintColor={
            colors.primary
          }
          progressBackgroundColor={
            colors.surface
          }
        />
      }
    >
      {/* CITY HEADER */}
      <View
        style={styles.cityCard}
      >
        <View style={styles.cityInfo}>
          <Text
            style={styles.cityName}
          >
            {city.name}
          </Text>

          <Text
            style={
              styles.cityLocation
            }
          >
            {city.region
              ? `${city.region}, `
              : ''}

            {city.country}
          </Text>
        </View>

        {showFavoriteButton &&
          onToggleFavorite && (
            <Pressable
              style={({ pressed }) => [
                styles.favoriteButton,

                pressed &&
                  styles.pressed,
              ]}
              onPress={
                onToggleFavorite
              }
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Star
                size={34}
                strokeWidth={2.2}
                color={
                  isFavorite
                    ? colors.favorite
                    : colors.text
                }
                fill={
                  isFavorite
                    ? colors.favorite
                    : 'transparent'
                }
              />
            </Pressable>
          )}
      </View>

      {/* INITIAL WEATHER LOADING */}
      {isLoading && !weather && (
        <View
          style={
            styles.loadingContainer
          }
        >
          <ActivityIndicator
            size="large"
            color={
              foregroundColor
            }
          />

          <Text
            style={[
              styles.loadingText,
              {
                color:
                  foregroundColor,
              },
            ]}
          >
            Loading weather...
          </Text>
        </View>
      )}

      {/* ERROR */}
      {error && !weather && (
        <View
          style={
            styles.errorContainer
          }
        >
          <Text
            style={[
              styles.errorTitle,
              {
                color:
                  foregroundColor,
              },
            ]}
          >
            Weather unavailable
          </Text>

          <Text
            style={[
              styles.errorText,
              {
                color:
                  foregroundColor,
              },
            ]}
          >
            {error}
          </Text>
        </View>
      )}

      {weather && (
        <>
          {/* CURRENT TEMPERATURE */}
          <View
            style={
              styles.temperatureSection
            }
          >
            <Text
              style={[
                styles.temperature,
                {
                  color:
                    foregroundColor,

                  fontSize:
                    temperatureSize,

                  lineHeight:
                    temperatureSize *
                    1.05,
                },
              ]}
            >
              {Math.round(
                weather.current
                  .temperature
              )}
              °
            </Text>

            <Text
              style={[
                styles.conditionLabel,
                {
                  color:
                    foregroundColor,
                },
              ]}
            >
              {
                currentCondition?.label
              }
            </Text>
          </View>

          {/* SEPARATOR */}
          <View
            style={[
              styles.separator,
              {
                backgroundColor:
                  foregroundColor,
              },
            ]}
          />

          {/* CURRENT METRICS */}
          <View
            style={
              styles.metricsRow
            }
          >
            <View
              style={
                styles.metricPill
              }
            >
              <Thermometer
                size={17}
                color={
                  colors.text
                }
                strokeWidth={2.2}
              />

              <Text
                numberOfLines={1}
                style={
                  styles.metricText
                }
              >
                Feels{' '}
                <Text
                  style={
                    styles.metricValue
                  }
                >
                  {Math.round(
                    weather.current
                      .apparentTemperature
                  )}
                  °
                </Text>
              </Text>
            </View>

            <View
              style={
                styles.metricPill
              }
            >
              <Droplets
                size={17}
                color={
                  colors.text
                }
                strokeWidth={2.2}
              />

              <Text
                numberOfLines={1}
                style={
                  styles.metricText
                }
              >
                Humidity{' '}
                <Text
                  style={
                    styles.metricValue
                  }
                >
                  {
                    weather.current
                      .humidity
                  }
                  %
                </Text>
              </Text>
            </View>

            <View
              style={
                styles.metricPill
              }
            >
              <Wind
                size={17}
                color={
                  colors.text
                }
                strokeWidth={2.2}
              />

              <Text
                numberOfLines={1}
                style={
                  styles.metricText
                }
              >
                Wind{' '}
                <Text
                  style={
                    styles.metricValue
                  }
                >
                  {weather.current
                    .windSpeed}{' '}
                  km/h
                </Text>
              </Text>
            </View>
          </View>

          {/* HOURLY FORECAST */}
          <View
            style={styles.section}
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    foregroundColor,
                },
              ]}
            >
              Hourly Forecast
            </Text>

            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.hourlyList
              }
            >
              {weather.hourly.map(
                (hour) => {
                  const condition =
                    getWeatherCondition(
                      hour.weatherCode,
                      hour.isDay
                    );

                  return (
                    <View
                      key={hour.time}
                      style={
                        styles.hourlyCard
                      }
                    >
                      <Text
                        style={
                          styles.hourlyTime
                        }
                      >
                        {formatHour(
                          hour.time
                        )}
                      </Text>

                      <WeatherIcon
                        name={
                          condition.icon
                        }
                        size={31}
                        color={
                          colors.text
                        }
                        strokeWidth={
                          1.9
                        }
                      />

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
                    </View>
                  );
                }
              )}
            </ScrollView>
          </View>

          {/* 7 DAY FORECAST */}
          <View
            style={
              styles.dailySection
            }
          >
            <Text
              style={[
                styles.sectionTitle,
                {
                  color:
                    foregroundColor,
                },
              ]}
            >
              7 Day Forecast
            </Text>

            <View
              style={
                styles.dailyContainer
              }
            >
              {weather.daily.map(
                (
                  day,
                  index
                ) => {
                  const condition =
                    getWeatherCondition(
                      day.weatherCode,
                      true
                    );

                  return (
                    <View
                      key={day.date}
                    >
                      <View
                        style={
                          styles.dailyRow
                        }
                      >
                        <Text
                          style={
                            styles.dailyDay
                          }
                        >
                          {index === 0
                            ? 'Today'
                            : formatDay(
                                day.date
                              )}
                        </Text>

                        <View
                          style={
                            styles.dailyCondition
                          }
                        >
                          <WeatherIcon
                            name={
                              condition.icon
                            }
                            size={26}
                            color={
                              colors.text
                            }
                            strokeWidth={
                              1.9
                            }
                          />

                          <Text
                            style={
                              styles.dailyRain
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
                              styles.dailyMax
                            }
                          >
                            {Math.round(
                              day.temperatureMax
                            )}
                            °
                          </Text>

                          <Text
                            style={
                              styles.dailyMin
                            }
                          >
                            {Math.round(
                              day.temperatureMin
                            )}
                            °
                          </Text>
                        </View>
                      </View>

                      {index !==
                        weather.daily
                          .length -
                          1 && (
                        <View
                          style={
                            styles.dailyDivider
                          }
                        />
                      )}
                    </View>
                  );
                }
              )}
            </View>
          </View>

          {/* Space for floating search button */}
          <View
            style={
              styles.bottomSpacer
            }
          />
        </>
      )}
    </ScrollView>
  );
}

function formatHour(
  time: string
) {
  const hour = Number(
    time.slice(11, 13)
  );

  const suffix =
    hour >= 12
      ? 'pm'
      : 'am';

  const displayHour =
    hour % 12 || 12;

  return `${displayHour} ${suffix}`;
}

function formatDay(
  date: string
) {
  const parsedDate = new Date(
    `${date}T12:00:00`
  );

  return parsedDate.toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
    }
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,

      paddingTop: 34,

      paddingBottom: 24,
    },

    cityCard: {
      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 16,

      paddingVertical: 12,

      borderRadius: 14,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    cityInfo: {
      flex: 1,
    },

    cityName: {
      fontSize: 21,

      lineHeight: 24,

      fontWeight: '700',

      color: colors.text,
    },

    cityLocation: {
      marginTop: 2,

      fontSize: 15,

      color: colors.text,
    },

    favoriteButton: {
      width: 44,

      height: 44,

      alignItems: 'center',

      justifyContent:
        'center',
    },

    pressed: {
      opacity: 0.6,
    },

    loadingContainer: {
      flex: 1,

      minHeight: 400,

      alignItems: 'center',

      justifyContent:
        'center',

      gap: 12,
    },

    loadingText: {
      fontSize: 15,

      fontWeight: '500',
    },

    errorContainer: {
      minHeight: 350,

      justifyContent:
        'center',

      alignItems: 'center',

      gap: 8,

      paddingHorizontal: 20,
    },

    errorTitle: {
      fontSize: 20,

      fontWeight: '700',
    },

    errorText: {
      textAlign: 'center',
    },

    temperatureSection: {
      marginTop: 34,

      alignItems:
        'flex-start',
    },

    temperature: {
      marginLeft: -4,

      fontWeight: '700',

      letterSpacing: -7,
    },

    conditionLabel: {
      marginTop: -4,

      marginLeft: 4,

      fontSize: 16,

      fontWeight: '600',

      opacity: 0.8,
    },

    separator: {
      height: 3,

      marginTop: 24,

      marginBottom: 26,

      borderRadius: 2,

      opacity: 0.9,
    },

    metricsRow: {
      flexDirection: 'row',

      gap: 8,
    },

    metricPill: {
      flex: 1,

      minHeight: 42,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      gap: 4,

      paddingHorizontal: 7,

      borderRadius: 8,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    metricText: {
      flexShrink: 1,

      fontSize: 11,

      fontWeight: '600',

      color: colors.text,
    },

    metricValue: {
      fontWeight: '800',
    },

    section: {
      marginTop: 28,
    },

    sectionTitle: {
      marginBottom: 12,

      fontSize: 18,

      fontWeight: '700',
    },

    hourlyList: {
      gap: 10,

      paddingRight: 20,
    },

    hourlyCard: {
      width: 78,

      minHeight: 110,

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 8,

      paddingVertical: 10,

      borderRadius: 9,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    hourlyTime: {
      fontSize: 14,

      fontWeight: '700',

      color: colors.text,
    },

    hourlyTemperature: {
      fontSize: 19,

      fontWeight: '600',

      color: colors.text,
    },

    dailySection: {
      marginTop: 30,
    },

    dailyContainer: {
      overflow: 'hidden',

      borderRadius: 14,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surface,
    },

    dailyRow: {
      minHeight: 68,

      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: 14,
    },

    dailyDay: {
      flex: 1,

      fontSize: 15,

      fontWeight: '700',

      color: colors.text,
    },

    dailyCondition: {
      width: 82,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'flex-start',

      gap: 6,
    },

    dailyRain: {
      fontSize: 12,

      color:
        colors.textMuted,
    },

    dailyTemperatures: {
      width: 72,

      flexDirection: 'row',

      justifyContent:
        'flex-end',

      gap: 10,
    },

    dailyMax: {
      fontSize: 16,

      fontWeight: '800',

      color: colors.text,
    },

    dailyMin: {
      fontSize: 16,

      fontWeight: '600',

      color:
        colors.textMuted,
    },

    dailyDivider: {
      height: 1,

      marginLeft: 14,

      backgroundColor:
        colors.border,
    },

    bottomSpacer: {
      height: 70,
    },
  });
}