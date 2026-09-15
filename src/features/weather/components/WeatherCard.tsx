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
  LayoutGrid,
  Star,
  Thermometer,
  Wind,
} from 'lucide-react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type {
  City,
} from '../../city-search/model/city';

import {
  useWidgetCity,
} from '../../weather-widget/context/WidgetCityContext';

import type {
  Weather,
} from '../model/weather';

import {
  getWeatherCondition,
} from '../utils/getWeatherCondition';

import {
  WeatherIcon,
} from './WeatherIcon';

import type {
  AppColors,
} from '../../../shared/theme/theme';

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
  const {
    width,
  } =
    useWindowDimensions();

  const insets =
    useSafeAreaInsets();

  const {
    colors,
    isDark,
  } =
    useAppTheme();

  const {
    isWidgetCity,
    selectWidgetCity,
  } =
    useWidgetCity();

  /*
   * Light mode always uses our
   * dark neutral text color.
   *
   * Dark mode uses the normal
   * theme text color.
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

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  const selectedForWidget =
    isWidgetCity(
      city
    );

  /*
   * Responsive temperature size.
   *
   * Large enough to remain the main
   * visual element without dominating
   * the complete screen.
   */
  const temperatureSize =
    Math.min(
      width * 0.24,
      96
    );

  return (
    <ScrollView
      style={
        styles.container
      }
      contentContainerStyle={[
        styles.content,

        fullScreen && {
          paddingTop:
            insets.top +
            14,

          paddingBottom:
            insets.bottom +
            105,
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
          onRefresh={
            onRefresh
          }
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
      {/* HEADER */}

      <View
        style={
          styles.header
        }
      >
        <View
          style={
            styles.cityInfo
          }
        >
          <Text
            numberOfLines={
              1
            }
            style={
              styles.cityName
            }
          >
            {city.name}
          </Text>

          <Text
            numberOfLines={
              1
            }
            style={
              styles.cityLocation
            }
          >
            {formatLocation(
              city
            )}
          </Text>
        </View>

        <View
          style={
            styles.headerActions
          }
        >
          {/* FAVORITE BUTTON */}

          {showFavoriteButton &&
            onToggleFavorite && (
              <Pressable
                style={({
                  pressed,
                }) => [
                  styles.headerButton,

                  pressed &&
                    styles.headerButtonPressed,
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
                  size={27}
                  strokeWidth={
                    2
                  }
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

          {/* WIDGET CITY BUTTON */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.headerButton,

              selectedForWidget &&
                styles.widgetButtonSelected,

              pressed &&
                styles.headerButtonPressed,
            ]}
            onPress={() =>
              void selectWidgetCity(
                city
              )
            }
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              selectedForWidget
                ? `${city.name} is used by the weather widget`
                : `Use ${city.name} for the weather widget`
            }
          >
            <LayoutGrid
              size={26}
              strokeWidth={
                selectedForWidget
                  ? 2.6
                  : 2
              }
              color={
                selectedForWidget
                  ? colors.primary
                  : textColor
              }
            />
          </Pressable>
        </View>
      </View>

      {/* INITIAL LOADING */}

      {isLoading &&
        !weather && (
          <View
            style={
              styles.stateContainer
            }
          >
            <ActivityIndicator
              size="large"
              color={
                colors.primary
              }
            />

            <Text
              style={
                styles.stateText
              }
            >
              Loading weather...
            </Text>
          </View>
        )}

      {/* INITIAL ERROR */}

      {error &&
        !weather && (
          <View
            style={
              styles.stateContainer
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
                styles.stateText
              }
            >
              {error}
            </Text>

            <Pressable
              style={({
                pressed,
              }) => [
                styles.retryButton,

                pressed &&
                  styles.retryButtonPressed,
              ]}
              onPress={
                onRefresh
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Try again
              </Text>
            </Pressable>
          </View>
        )}

      {weather && (
        <>
          {/* CURRENT WEATHER */}

          <View
            style={
              styles.currentWeather
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

            {currentCondition && (
              <View
                style={
                  styles.condition
                }
              >
                <WeatherIcon
                  name={
                    currentCondition.icon
                  }
                  size={33}
                  color={
                    textColor
                  }
                  strokeWidth={
                    1.8
                  }
                />

                <Text
                  style={
                    styles.conditionLabel
                  }
                >
                  {
                    currentCondition.label
                  }
                </Text>
              </View>
            )}
          </View>

          {/* HOURLY FORECAST */}

          <View
            style={
              styles.hourlyContainer
            }
          >
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.hourlyContent
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
                        styles.hourItem
                      }
                    >
                      <Text
                        style={
                          styles.hourTime
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
                        size={24}
                        color={
                          textColor
                        }
                        strokeWidth={
                          1.8
                        }
                      />

                      <Text
                        style={
                          styles.hourTemperature
                        }
                      >
                        {Math.round(
                          hour.temperature
                        )}
                        °
                      </Text>

                      <Text
                        style={
                          styles.hourRain
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

          {/* CURRENT DETAILS */}

          <Text
            style={
              styles.sectionTitle
            }
          >
            Details
          </Text>

          <View
            style={
              styles.detailsContainer
            }
          >
            <View
              style={
                styles.detailItem
              }
            >
              <Thermometer
                size={19}
                color={
                  textColor
                }
                strokeWidth={
                  1.9
                }
              />

              <Text
                style={
                  styles.detailLabel
                }
              >
                Feels like
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {Math.round(
                  weather.current
                    .apparentTemperature
                )}
                °
              </Text>
            </View>

            <View
              style={
                styles.detailDivider
              }
            />

            <View
              style={
                styles.detailItem
              }
            >
              <Droplets
                size={19}
                color={
                  textColor
                }
                strokeWidth={
                  1.9
                }
              />

              <Text
                style={
                  styles.detailLabel
                }
              >
                Humidity
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {
                  weather.current
                    .humidity
                }
                %
              </Text>
            </View>

            <View
              style={
                styles.detailDivider
              }
            />

            <View
              style={
                styles.detailItem
              }
            >
              <Wind
                size={19}
                color={
                  textColor
                }
                strokeWidth={
                  1.9
                }
              />

              <Text
                style={
                  styles.detailLabel
                }
              >
                Wind
              </Text>

              <Text
                numberOfLines={
                  1
                }
                style={
                  styles.detailValue
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

          {/* DAILY FORECAST */}

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
                      {/* DAY */}

                      <Text
                        style={
                          styles.dailyDay
                        }
                      >
                        {index ===
                        0
                          ? 'Today'
                          : formatDay(
                              day.date
                            )}
                      </Text>

                      {/* CONDITION */}

                      <View
                        style={
                          styles.dailyCondition
                        }
                      >
                        <WeatherIcon
                          name={
                            condition.icon
                          }
                          size={23}
                          color={
                            textColor
                          }
                          strokeWidth={
                            1.8
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

                      {/* TEMPERATURE */}

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
        </>
      )}
    </ScrollView>
  );
}

function formatLocation(
  city: City
) {
  const parts: string[] =
    [];

  if (
    city.region &&
    city.region !==
      city.name
  ) {
    parts.push(
      city.region
    );
  }

  if (city.country) {
    parts.push(
      city.country
    );
  }

  return parts.join(
    ', '
  );
}

function formatHour(
  time: string
) {
  const hour =
    Number(
      time.slice(
        11,
        13
      )
    );

  const suffix =
    hour >= 12
      ? 'pm'
      : 'am';

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}${suffix}`;
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
      weekday:
        'short',
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

      backgroundColor:
        colors.background,
    },

    content: {
      flexGrow: 1,

      paddingHorizontal:
        20,

      paddingTop: 24,

      paddingBottom: 28,
    },

    /*
     * Header
     */

    header: {
      minHeight: 52,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    cityInfo: {
      flex: 1,

      paddingRight: 10,
    },

    cityName: {
      fontSize: 22,

      lineHeight: 27,

      fontWeight:
        '800',

      letterSpacing:
        -0.4,

      color:
        textColor,
    },

    cityLocation: {
      marginTop: 2,

      fontSize: 12,

      lineHeight: 16,

      fontWeight:
        '500',

      color:
        textColor,

      opacity: 0.58,
    },

    headerActions: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 2,
    },

    headerButton: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems:
        'center',

      justifyContent:
        'center',
    },

    widgetButtonSelected: {
      backgroundColor:
        colors.surfaceSecondary,
    },

    headerButtonPressed: {
      opacity: 0.55,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },

    /*
     * Loading / error
     */

    stateContainer: {
      minHeight: 400,

      flex: 1,

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 12,

      paddingHorizontal:
        24,
    },

    stateText: {
      color:
        textColor,

      opacity: 0.65,

      textAlign:
        'center',

      fontSize: 14,

      lineHeight: 20,
    },

    errorTitle: {
      fontSize: 19,

      fontWeight:
        '700',

      color:
        textColor,
    },

    retryButton: {
      marginTop: 4,

      paddingHorizontal:
        18,

      paddingVertical:
        10,

      borderRadius: 20,

      backgroundColor:
        colors.primary,
    },

    retryButtonPressed: {
      opacity: 0.75,
    },

    retryText: {
      color:
        colors.primaryText,

      fontSize: 14,

      fontWeight:
        '700',
    },

    /*
     * Current weather
     */

    currentWeather: {
      minHeight: 120,

      marginTop: 16,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',
    },

    temperature: {
      color:
        textColor,

      fontWeight:
        '800',

      letterSpacing:
        -5,
    },

    condition: {
      maxWidth: '45%',

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'flex-end',

      gap: 7,
    },

    conditionLabel: {
      color:
        textColor,

      fontSize: 13,

      fontWeight:
        '600',

      textAlign:
        'right',
    },

    /*
     * One single hourly forecast card,
     * matching the widget style.
     */

    hourlyContainer: {
      overflow:
        'hidden',

      borderRadius: 22,

      backgroundColor:
        colors.surface,

      marginTop: 8,
    },

    hourlyContent: {
      minWidth: '100%',

      paddingHorizontal:
        10,

      paddingVertical:
        14,

      gap: 2,
    },

    hourItem: {
      width: 62,

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 6,
    },

    hourTime: {
      color:
        textColor,

      opacity: 0.58,

      fontSize: 10,

      fontWeight:
        '600',
    },

    hourTemperature: {
      color:
        textColor,

      fontSize: 15,

      fontWeight:
        '800',
    },

    hourRain: {
      color:
        textColor,

      opacity: 0.5,

      fontSize: 9,

      fontWeight:
        '600',
    },

    /*
     * Section titles
     */

    sectionTitle: {
      marginTop: 28,

      marginBottom: 10,

      color:
        textColor,

      fontSize: 15,

      lineHeight: 20,

      fontWeight:
        '700',
    },

    /*
     * Weather details
     *
     * One container instead of three
     * individual floating pills.
     */

    detailsContainer: {
      minHeight: 86,

      flexDirection:
        'row',

      alignItems:
        'stretch',

      borderRadius: 22,

      backgroundColor:
        colors.surface,

      paddingVertical:
        13,
    },

    detailItem: {
      flex: 1,

      minWidth: 0,

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 3,

      paddingHorizontal:
        5,
    },

    detailDivider: {
      width: 1,

      marginVertical:
        5,

      backgroundColor:
        colors.border,
    },

    detailLabel: {
      marginTop: 2,

      color:
        textColor,

      opacity: 0.55,

      fontSize: 9,

      fontWeight:
        '600',
    },

    detailValue: {
      color:
        textColor,

      fontSize: 13,

      fontWeight:
        '800',

      textAlign:
        'center',
    },

    /*
     * 7 day forecast
     */

    dailyContainer: {
      overflow:
        'hidden',

      borderRadius: 22,

      backgroundColor:
        colors.surface,
    },

    dailyRow: {
      minHeight: 62,

      flexDirection:
        'row',

      alignItems:
        'center',

      paddingHorizontal:
        15,
    },

    dailyDay: {
      flex: 1,

      color:
        textColor,

      fontSize: 14,

      fontWeight:
        '700',
    },

    dailyCondition: {
      width: 78,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'flex-start',

      gap: 6,
    },

    dailyRain: {
      color:
        textColor,

      opacity: 0.5,

      fontSize: 10,

      fontWeight:
        '600',
    },

    dailyTemperatures: {
      width: 78,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'flex-end',

      gap: 10,
    },

    dailyMax: {
      color:
        textColor,

      fontSize: 15,

      fontWeight:
        '800',
    },

    dailyMin: {
      color:
        textColor,

      opacity: 0.48,

      fontSize: 15,

      fontWeight:
        '600',
    },

    dailyDivider: {
      height: 1,

      marginLeft: 15,

      marginRight: 15,

      backgroundColor:
        colors.border,
    },
  });
}