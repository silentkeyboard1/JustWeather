import { useState } from 'react';

import { router } from 'expo-router';

import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ArrowLeft,
  Search,
} from 'lucide-react-native';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  searchCities,
} from '../features/city-search/api/searchCities';

import {
  CitySearchForm,
} from '../features/city-search/components/CitySearchForm';

import {
  CitySearchResults,
} from '../features/city-search/components/CitySearchResults';

import type {
  City,
} from '../features/city-search/model/city';

import {
  useFavorites,
} from '../features/favorites/context/FavoritesContext';

import {
  WeatherPage,
} from '../features/weather/components/WeatherPage';

import type {
  AppColors,
} from '../shared/theme/theme';

import {
  useAppTheme,
} from '../shared/theme/theme';

export default function SearchScreen() {
  const insets =
    useSafeAreaInsets();

  const {
    colors,
  } =
    useAppTheme();

  const styles =
    createStyles(
      colors
    );

  const {
    isFavorite,
    toggleFavorite,
  } =
    useFavorites();

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState('');

  const [
    cities,
    setCities,
  ] =
    useState<City[]>(
      []
    );

  const [
    selectedCity,
    setSelectedCity,
  ] =
    useState<City | null>(
      null
    );

  const [
    isSearching,
    setIsSearching,
  ] =
    useState(false);

  const [
    searchError,
    setSearchError,
  ] =
    useState<string | null>(
      null
    );

  async function handleSearch() {
    const trimmedSearchTerm =
      searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSearchError(
        'Please enter a city.'
      );

      return;
    }

    setIsSearching(
      true
    );

    setSearchError(
      null
    );

    setSelectedCity(
      null
    );

    try {
      const foundCities =
        await searchCities(
          trimmedSearchTerm
        );

      setCities(
        foundCities
      );

      Keyboard.dismiss();

      if (
        foundCities.length ===
        0
      ) {
        setSearchError(
          'No matching cities found.'
        );
      }
    } catch (error) {
      console.error(
        'City search failed:',
        error
      );

      Keyboard.dismiss();

      setCities(
        []
      );

      setSearchError(
        'City search failed. Please try again.'
      );
    } finally {
      setIsSearching(
        false
      );
    }
  }

  function handleCitySelect(
    city: City
  ) {
    Keyboard.dismiss();

    setSelectedCity(
      city
    );

    setSearchError(
      null
    );
  }

  async function handleToggleFavorite(
    city: City
  ) {
    await toggleFavorite(
      city
    );
  }

  function handleBackToHome() {
    /*
     * Replace the Search route with Home.
     *
     * This means the back button on the
     * selected city's weather page does
     * NOT return to the search results.
     */
    router.replace('/');
  }

  /*
   * -----------------------------------
   * SELECTED CITY
   * -----------------------------------
   *
   * Once a city is selected, WeatherPage
   * takes over the complete screen.
   */
  if (selectedCity) {
    return (
      <View
        style={
          styles.weatherScreen
        }
      >
        <WeatherPage
          city={
            selectedCity
          }
          isCurrentLocation={
            false
          }
          isFavorite={
            isFavorite(
              selectedCity.id
            )
          }
          onToggleFavorite={
            handleToggleFavorite
          }
          useWeatherBackground
        />

        {/*
         * Floating back button.
         *
         * This now returns directly
         * to the Home screen.
         */}
        <Pressable
          style={({
            pressed,
          }) => [
            styles.backToHomeButton,

            {
              bottom:
                insets.bottom +
                18,
            },

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={
            handleBackToHome
          }
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <ArrowLeft
            size={25}
            strokeWidth={
              2.2
            }
            color={
              colors.primaryText
            }
          />
        </Pressable>
      </View>
    );
  }

  /*
   * -----------------------------------
   * SEARCH MODE
   * -----------------------------------
   */
  return (
    <View
      style={[
        styles.container,

        {
          paddingTop:
            insets.top +
            16,

          paddingBottom:
            insets.bottom +
            16,
        },
      ]}
    >
      {/* HEADER */}

      <View
        style={
          styles.header
        }
      >
        <Pressable
          style={({
            pressed,
          }) => [
            styles.backButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={() =>
            router.back()
          }
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <ArrowLeft
            size={24}
            color={
              colors.text
            }
          />
        </Pressable>

        <View
          style={
            styles.headerText
          }
        >
          <View
            style={
              styles.titleRow
            }
          >
            <Search
              size={22}
              color={
                colors.primary
              }
            />

            <Text
              style={
                styles.title
              }
            >
              Search city
            </Text>
          </View>

          <Text
            style={
              styles.subtitle
            }
          >
            Search for a city to view its weather or add it to your favorites.
          </Text>
        </View>
      </View>

      {/* SEARCH INPUT */}

      <CitySearchForm
        city={
          searchTerm
        }
        isLoading={
          isSearching
        }
        onCityChange={(
          value
        ) => {
          setSearchTerm(
            value
          );

          if (
            searchError
          ) {
            setSearchError(
              null
            );
          }
        }}
        onSearch={
          handleSearch
        }
      />

      {/* SEARCH ERROR */}

      {searchError && (
        <Text
          style={
            styles.errorText
          }
        >
          {searchError}
        </Text>
      )}

      {/* RESULTS */}

      {cities.length >
        0 && (
        <View
          style={
            styles.resultsContainer
          }
        >
          <Text
            style={
              styles.resultsTitle
            }
          >
            Results
          </Text>

          <CitySearchResults
            cities={
              cities
            }
            onCitySelect={
              handleCitySelect
            }
          />
        </View>
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

      paddingHorizontal:
        20,

      backgroundColor:
        colors.background,
    },

    weatherScreen: {
      flex: 1,

      backgroundColor:
        colors.background,
    },

    header: {
      flexDirection:
        'row',

      alignItems:
        'flex-start',

      gap: 12,

      marginBottom:
        24,
    },

    backButton: {
      width: 44,

      height: 44,

      borderRadius:
        22,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        colors.surface,

      borderWidth:
        1,

      borderColor:
        colors.border,
    },

    headerText: {
      flex: 1,
    },

    titleRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 8,
    },

    title: {
      fontSize: 26,

      fontWeight:
        '800',

      color:
        colors.text,
    },

    subtitle: {
      marginTop: 5,

      color:
        colors.textMuted,

      lineHeight: 20,
    },

    errorText: {
      marginTop: 12,

      color:
        colors.error,

      fontWeight:
        '500',
    },

    resultsContainer: {
      flex: 1,

      marginTop: 22,
    },

    resultsTitle: {
      marginBottom:
        10,

      fontSize: 16,

      fontWeight:
        '700',

      color:
        colors.text,
    },

    /*
     * Floating button shown only
     * after selecting a city.
     */
    backToHomeButton: {
      position:
        'absolute',

      right: 20,

      width: 58,

      height: 58,

      borderRadius:
        29,

      alignItems:
        'center',

      justifyContent:
        'center',

      backgroundColor:
        colors.primary,

      borderWidth:
        1,

      borderColor:
        colors.border,

      zIndex: 100,
    },

    buttonPressed: {
      opacity: 0.7,

      transform: [
        {
          scale: 0.95,
        },
      ],
    },
  });
}