import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { router } from 'expo-router';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  LocateFixed,
  RefreshCw,
  Search,
} from 'lucide-react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import type { City } from '../features/city-search/model/city';

import { useFavorites } from '../features/favorites/context/FavoritesContext';

import { getCurrentCity } from '../features/location/api/getCurrentCity';

import { WeatherPage } from '../features/weather/components/WeatherPage';

import type { AppColors } from '../shared/theme/theme';

import { useAppTheme } from '../shared/theme/theme';

export default function HomeScreen() {
  const { width } =
    useWindowDimensions();

  const insets =
    useSafeAreaInsets();

  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  const pagerRef =
    useRef<FlatList<City>>(
      null
    );

  const {
    favoriteCities,
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const [
    currentCity,
    setCurrentCity,
  ] = useState<City | null>(
    null
  );

  const [
    isLoadingLocation,
    setIsLoadingLocation,
  ] = useState(true);

  const [
    locationError,
    setLocationError,
  ] = useState<
    string | null
  >(null);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);

  const weatherCities =
    useMemo(() => {
      if (currentCity) {
        return [
          currentCity,
          ...favoriteCities,
        ];
      }

      return favoriteCities;
    }, [
      currentCity,
      favoriteCities,
    ]);

  const loadCurrentLocation =
    useCallback(async () => {
      setIsLoadingLocation(
        true
      );

      setLocationError(null);

      try {
        const city =
          await getCurrentCity();

        setCurrentCity(city);
      } catch (error) {
        console.error(
          'Failed to load location:',
          error
        );

        if (
          error instanceof Error &&
          error.message ===
            'LOCATION_PERMISSION_DENIED'
        ) {
          setLocationError(
            'Location permission is required to show the weather for your current location.'
          );
        } else {
          setLocationError(
            'Your current location could not be determined.'
          );
        }
      } finally {
        setIsLoadingLocation(
          false
        );
      }
    }, []);

  useEffect(() => {
    void loadCurrentLocation();
  }, [loadCurrentLocation]);

  useEffect(() => {
    if (
      activeIndex <
      weatherCities.length
    ) {
      return;
    }

    setActiveIndex(0);

    pagerRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  }, [
    activeIndex,
    weatherCities.length,
  ]);

  async function handleToggleFavorite(
    city: City
  ) {
    if (
      city.id ===
      'current-location'
    ) {
      return;
    }

    const wasFavorite =
      isFavorite(city.id);

    await toggleFavorite(city);

    if (
      wasFavorite &&
      currentCity
    ) {
      setActiveIndex(0);

      pagerRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  }

  function handlePageChanged(
    offsetX: number
  ) {
    const newIndex =
      Math.round(
        offsetX / width
      );

    setActiveIndex(newIndex);
  }

  function handleRetryLocation() {
    void loadCurrentLocation();
  }

  const hasPages =
    weatherCities.length > 0;

  return (
    <View style={styles.container}>
      {/* LOCATION LOADING */}

      {isLoadingLocation &&
        !hasPages && (
          <View
            style={[
              styles.center,

              {
                paddingTop:
                  insets.top,

                paddingBottom:
                  insets.bottom,
              },
            ]}
          >
            <ActivityIndicator
              size="large"
              color={
                colors.primary
              }
            />

            <Text
              style={
                styles.mutedText
              }
            >
              Finding your location...
            </Text>
          </View>
        )}

      {/* LOCATION ERROR */}

      {locationError &&
        !hasPages && (
          <View
            style={[
              styles.errorContainer,

              {
                paddingTop:
                  insets.top,

                paddingBottom:
                  insets.bottom,
              },
            ]}
          >
            <LocateFixed
              size={42}
              color={
                colors.error
              }
            />

            <Text
              style={
                styles.errorTitle
              }
            >
              Location unavailable
            </Text>

            <Text
              style={
                styles.errorText
              }
            >
              {locationError}
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.retryButton,

                pressed &&
                  styles.retryButtonPressed,
              ]}
              onPress={
                handleRetryLocation
              }
            >
              <RefreshCw
                size={18}
                color={
                  colors.primaryText
                }
              />

              <Text
                style={
                  styles.retryButtonText
                }
              >
                Try again
              </Text>
            </Pressable>
          </View>
        )}

      {/* LOCATION WARNING */}

      {locationError &&
        hasPages && (
          <View
            style={[
              styles.locationWarning,

              {
                top:
                  insets.top +
                  10,
              },
            ]}
          >
            <Text
              style={
                styles.locationWarningText
              }
            >
              Current location unavailable.
            </Text>

            <Pressable
              onPress={
                handleRetryLocation
              }
              hitSlop={8}
            >
              <RefreshCw
                size={18}
                color={
                  colors.primary
                }
              />
            </Pressable>
          </View>
        )}

      {/* WEATHER PAGER */}

      {hasPages && (
        <FlatList
          ref={pagerRef}
          data={weatherCities}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={
            false
          }
          keyExtractor={
            (city) => city.id
          }
          style={styles.pager}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
          getItemLayout={(
            _,
            index
          ) => ({
            length: width,

            offset:
              width * index,

            index,
          })}
          onMomentumScrollEnd={(
            event
          ) => {
            handlePageChanged(
              event.nativeEvent
                .contentOffset.x
            );
          }}
          renderItem={({
            item: city,
          }) => {
            const isCurrentLocation =
              city.id ===
              'current-location';

            return (
              <View
                style={[
                  styles.page,

                  {
                    width,
                  },
                ]}
              >
                <WeatherPage
                  city={city}
                  isCurrentLocation={
                    isCurrentLocation
                  }
                  isFavorite={
                    isCurrentLocation
                      ? false
                      : isFavorite(
                          city.id
                        )
                  }
                  onToggleFavorite={
                    handleToggleFavorite
                  }
                  useWeatherBackground
                />
              </View>
            );
          }}
        />
      )}

      {/* PAGINATION */}

      {weatherCities.length >
        1 && (
        <View
          style={[
            styles.pagination,

            {
              bottom:
                insets.bottom +
                30,
            },
          ]}
          pointerEvents="none"
        >
          {weatherCities.map(
            (city, index) => (
              <View
                key={city.id}
                style={[
                  styles.dot,

                  index ===
                    activeIndex &&
                    styles.activeDot,
                ]}
              />
            )
          )}
        </View>
      )}

      {/* FLOATING SEARCH BUTTON */}

      <Pressable
        style={({ pressed }) => [
          styles.searchFab,

          {
            /*
             * Dynamically stay above
             * Android gesture navigation,
             * iPhone home indicator, etc.
             */
            bottom:
              insets.bottom +
              18,
          },

          pressed &&
            styles.searchFabPressed,
        ]}
        onPress={() =>
          router.push('/search')
        }
        accessibilityRole="button"
        accessibilityLabel="Search for a city"
      >
        <Search
          size={27}
          strokeWidth={2.2}
          color={
            colors.primaryText
          }
        />
      </Pressable>
    </View>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor:
        colors.background,
    },

    pager: {
      flex: 1,
    },

    page: {
      flex: 1,
    },

    center: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      gap: 12,

      paddingHorizontal: 24,
    },

    mutedText: {
      color:
        colors.textMuted,
    },

    errorContainer: {
      flex: 1,

      justifyContent:
        'center',

      alignItems: 'center',

      paddingHorizontal: 24,

      gap: 12,
    },

    errorTitle: {
      fontSize: 20,

      fontWeight: '700',

      color: colors.text,
    },

    errorText: {
      color:
        colors.textMuted,

      textAlign: 'center',

      lineHeight: 21,
    },

    retryButton: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 8,

      marginTop: 8,

      paddingHorizontal: 18,

      paddingVertical: 12,

      borderRadius: 12,

      backgroundColor:
        colors.primary,
    },

    retryButtonPressed: {
      opacity: 0.75,
    },

    retryButtonText: {
      color:
        colors.primaryText,

      fontWeight: '700',
    },

    locationWarning: {
      position: 'absolute',

      left: 20,

      right: 20,

      zIndex: 80,

      elevation: 8,

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:
        'space-between',

      paddingHorizontal: 14,

      paddingVertical: 10,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 12,

      backgroundColor:
        colors.surface,
    },

    locationWarningText: {
      color:
        colors.textMuted,
    },

    pagination: {
      position: 'absolute',

      left: 0,

      right: 0,

      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems: 'center',

      gap: 7,

      zIndex: 50,
    },

    dot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      backgroundColor:
        colors.border,
    },

    activeDot: {
      width: 18,

      backgroundColor:
        colors.primary,
    },

    searchFab: {
      position: 'absolute',

      left: 20,

      width: 60,

      height: 60,

      borderRadius: 30,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        colors.primary,

      borderWidth: 1,

      borderColor:
        colors.border,

      /*
       * iOS shadow
       */
      shadowColor: colors.text,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.2,

      shadowRadius: 9,

      /*
       * Android shadow / stacking.
       */
      elevation: 12,

      zIndex: 100,
    },

    searchFabPressed: {
      opacity: 0.82,

      transform: [
        {
          scale: 0.94,
        },
      ],
    },
  });
}