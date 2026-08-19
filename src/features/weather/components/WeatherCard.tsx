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

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { City } from '../../city-search/model/city';

import type { Weather } from '../model/weather';

import {
  getWeatherCondition,
} from '../utils/getWeatherCondition';

import { WeatherIcon } from './WeatherIcon';

import type { AppColors } from '../../../shared/theme/theme';

import {
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

  fullScreen?: boolean;
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
  fullScreen = false,
}: WeatherCardProps) {
  const { width } =
    useWindowDimensions();

  const insets =
    useSafeAreaInsets();

  const {
    colors,
    isDark,
  } = useAppTheme();

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  /*
   * Light mode:
   * all normal text uses #302F2C.
   *
   * Dark mode:
   * keep the normal theme/weather-aware
   * foreground color.
   */
  const textColor =
  isDark
    ? colors.text
    : '#302F2C';

  const styles =
    createStyles(
      colors,
      textColor
    );

  const temperatureSize =
    Math.min(
      width * 0.38,
      148
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,

        fullScreen && {
          paddingTop:
            insets.top + 14,

          paddingBottom:
            insets.bottom + 110,
        },
      ]}
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
            textColor
          }
          progressBackgroundColor={
            colors.surface
          }
          progressViewOffset={
            fullScreen
              ? insets.top
              : 0
          }
        />
      }
    >
      {/* CITY HEADER */}

      <View
        style={styles.header}
      >
        <View
          style={styles.cityInfo}
        >
          <Text
            numberOfLines={1}
            style={
              styles.cityName
            }
          >
            {city.name}
          </Text>

          <Text
            numberOfLines={1}
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
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={
                isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Star
                size={34}
                strokeWidth={2}
                color={
                  isFavorite
                    ? colors.favorite
                    : textColor
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

      {/* INITIAL LOADING */}

      {isLoading &&
        !weather && (
          <View
            style={
              styles.loadingContainer
            }
          >
            <ActivityIndicator
              size="large"
              color={
                textColor
              }
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading weather...
            </Text>
          </View>
        )}

      {/* ERROR */}

      {error &&
        !weather && (
          <View
            style={
              styles.errorContainer
            }
          >
            <Text
              style={
                styles.errorTitle
              }
            >
              Weather unavailable
            </Text>

            <Text
              style={
                styles.errorText
              }
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
                  fontSize:
                    temperatureSize,

                  lineHeight:
                    temperatureSize *
                    1.02,
                },
              ]}
            >
              {Math.round(
                weather.current
                  .temperature
              )}
              °
            </Text>

            {/* WEATHER CONDITION */}

            <View
              style={
                styles.conditionRow
              }
            >
              {currentCondition && (
                <WeatherIcon
                  name={
                    currentCondition.icon
                  }
                  size={22}
                  color={
                    textColor
                  }
                  strokeWidth={2}
                />
              )}

              <Text
                style={
                  styles.conditionLabel
                }
              >
                {
                  currentCondition?.label
                }
              </Text>
            </View>
          </View>

          {/* SEPARATOR */}

          <View
            style={
              styles.separator
            }
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
                size={18}
                color={
                  textColor
                }
                strokeWidth={2}
              />

              <View
                style={
                  styles.metricContent
                }
              >
                <Text
                  style={
                    styles.metricLabel
                  }
                >
                  Feels like
                </Text>

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
              </View>
            </View>

            <View
              style={
                styles.metricPill
              }
            >
              <Droplets
                size={18}
                color={
                  textColor
                }
                strokeWidth={2}
              />

              <View
                style={
                  styles.metricContent
                }
              >
                <Text
                  style={
                    styles.metricLabel
                  }
                >
                  Humidity
                </Text>

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
              </View>
            </View>

            <View
              style={
                styles.metricPill
              }
            >
              <Wind
                size={18}
                color={
                  textColor
                }
                strokeWidth={2}
              />

              <View
                style={
                  styles.metricContent
                }
              >
                <Text
                  style={
                    styles.metricLabel
                  }
                >
                  Wind
                </Text>

                <Text
                  numberOfLines={1}
                  style={
                    styles.metricValue
                  }
                >
                  {Math.round(
                    weather.current
                      .windSpeed
                  )}{' '}
                  km/h
                </Text>
              </View>
            </View>
          </View>

          {/* HOURLY FORECAST */}

          <View
            style={styles.section}
          >
            <Text
              style={
                styles.sectionTitle
              }
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
                      key={
                        hour.time
                      }
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
                        size={30}
                        color={
                          textColor
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

                      <Text
                        style={
                          styles.hourlyRain
                        }
                      >
                        {
                          hour.precipitationProbability
                        }
                        %
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
              style={
                styles.sectionTitle
              }
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
                      key={
                        day.date
                      }
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
                            size={25}
                            color={
                              textColor
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
  const parsedDate =
    new Date(
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
  colors: AppColors,
  textColor: string
) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 20,
      paddingTop: 30,
      paddingBottom: 24,
    },

    header: {
      flexDirection: 'row',

      alignItems: 'center',

      minHeight: 54,
    },

    cityInfo: {
      flex: 1,

      paddingRight: 12,
    },

    cityName: {
      fontSize: 28,

      lineHeight: 32,

      fontWeight: '800',

      letterSpacing: -0.7,

      color:
        textColor,
    },

    cityLocation: {
      marginTop: 3,

      fontSize: 14,

      fontWeight: '500',

      color:
        textColor,

      opacity: 0.72,
    },

    favoriteButton: {
      width: 52,

      height: 52,

      alignItems: 'center',

      justifyContent:
        'center',

      borderRadius: 26,
    },

    pressed: {
      opacity: 0.55,

      transform: [
        {
          scale: 0.94,
        },
      ],
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

      color:
        textColor,
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

      color:
        textColor,
    },

    errorText: {
      textAlign: 'center',

      color:
        textColor,
    },

    temperatureSection: {
      marginTop: 22,

      flexDirection: 'row',

      alignItems:
        'flex-end',

      justifyContent:
        'space-between',
    },

    temperature: {
      fontWeight: '800',

      letterSpacing: -8,

      textAlign: 'left',

      color:
        textColor,
    },

    conditionRow: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 7,

      paddingBottom: 18,
    },

    conditionLabel: {
      fontSize: 16,

      fontWeight: '600',

      color:
        textColor,

      opacity: 0.8,
    },

    separator: {
      height: 2,

      marginTop: 28,

      marginBottom: 24,

      borderRadius: 1,

      backgroundColor:
        textColor,

      opacity: 0.28,
    },

    metricsRow: {
      flexDirection: 'row',

      gap: 8,
    },

    metricPill: {
      flex: 1,

      minHeight: 58,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'center',

      gap: 7,

      paddingHorizontal: 0,

      paddingVertical: 0,

      borderRadius: 12,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    metricContent: {
      flexShrink: 1,
    },

    metricLabel: {
      fontSize: 10,

      lineHeight: 13,

      fontWeight: '600',

      color:
        textColor,

      opacity: 0.72,
    },

    metricValue: {
      marginTop: 1,

      fontSize: 13,

      lineHeight: 16,

      fontWeight: '800',

      color:
        textColor,
    },

    section: {
      marginTop: 30,
    },

    sectionTitle: {
      marginBottom: 13,

      fontSize: 18,

      fontWeight: '700',

      color:
        textColor,
    },

    hourlyList: {
      gap: 10,

      paddingRight: 20,
    },

    hourlyCard: {
      width: 78,

      minHeight: 118,

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 8,

      paddingVertical: 10,

      borderRadius: 12,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    hourlyTime: {
      fontSize: 13,

      fontWeight: '700',

      color:
        textColor,
    },

    hourlyTemperature: {
      fontSize: 19,

      fontWeight: '700',

      color:
        textColor,
    },

    hourlyRain: {
      fontSize: 11,

      fontWeight: '600',

      color:
        textColor,

      opacity: 0.72,
    },

    dailySection: {
      marginTop: 32,
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

      color:
        textColor,
    },

    dailyCondition: {
      width: 82,

      flexDirection: 'row',

      alignItems: 'center',

      gap: 6,
    },

    dailyRain: {
      fontSize: 12,

      color:
        textColor,

      opacity: 0.72,
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

      color:
        textColor,
    },

    dailyMin: {
      fontSize: 16,

      fontWeight: '600',

      color:
        textColor,

      opacity: 0.7,
    },

    dailyDivider: {
      height: 1,

      marginLeft: 14,

      backgroundColor:
        colors.border,
    },
  });
}