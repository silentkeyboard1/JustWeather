import { useState } from 'react';

import { router } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ArrowLeft,
  Search,
} from 'lucide-react-native';

import { searchCities } from '../features/city-search/api/searchCities';

import { CitySearchForm } from '../features/city-search/components/CitySearchForm';

import { CitySearchResults } from '../features/city-search/components/CitySearchResults';

import type { City } from '../features/city-search/model/city';

import { useFavorites } from '../features/favorites/context/FavoritesContext';

import { WeatherPage } from '../features/weather/components/WeatherPage';

import type { AppColors } from '../shared/theme/theme';
import { useAppTheme } from '../shared/theme/theme';

export default function SearchScreen() {
  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  const {
    isFavorite,
    toggleFavorite,
  } = useFavorites();

  const [searchTerm, setSearchTerm] =
    useState('');

  const [cities, setCities] =
    useState<City[]>([]);

  const [
    selectedCity,
    setSelectedCity,
  ] = useState<City | null>(
    null
  );

  const [
    isSearching,
    setIsSearching,
  ] = useState(false);

  const [
    searchError,
    setSearchError,
  ] = useState<
    string | null
  >(null);

  async function handleSearch() {
    const trimmedSearchTerm =
      searchTerm.trim();

    if (!trimmedSearchTerm) {
      setSearchError(
        'Bitte gib eine Stadt ein.'
      );

      return;
    }

    setIsSearching(true);

    setSearchError(null);

    setSelectedCity(null);

    try {
      const foundCities =
        await searchCities(
          trimmedSearchTerm
        );

      setCities(foundCities);

      if (
        foundCities.length === 0
      ) {
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
        'Die Stadtsuche ist fehlgeschlagen.'
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleCitySelect(
    city: City
  ) {
    setSelectedCity(city);

    // Trefferliste nach Auswahl verstecken.
    setCities([]);

    setSearchError(null);
  }

  function handleToggleFavorite(
    city: City
  ) {
    void toggleFavorite(city);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.headerText}>
          <View style={styles.titleRow}>
            <Search
              size={22}
              color={colors.primary}
            />

            <Text style={styles.title}>
              Stadt suchen
            </Text>
          </View>

          <Text style={styles.subtitle}>
            Suche nach einem Ort und füge
            ihn optional zu deinen
            Favoriten hinzu.
          </Text>
        </View>
      </View>

      <CitySearchForm
        city={searchTerm}
        isLoading={isSearching}
        onCityChange={
          setSearchTerm
        }
        onSearch={handleSearch}
      />

      {searchError && (
        <Text
          style={styles.errorText}
        >
          {searchError}
        </Text>
      )}

      <CitySearchResults
        cities={cities}
        onCitySelect={
          handleCitySelect
        }
      />

      {selectedCity && (
        <View
          style={
            styles.weatherContainer
          }
        >
          <WeatherPage
            city={selectedCity}
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

      paddingHorizontal: 20,

      paddingTop: 28,

      backgroundColor:
        colors.background,
    },

    header: {
      flexDirection: 'row',

      alignItems: 'flex-start',

      gap: 12,

      marginBottom: 24,
    },

    buttonPressed: {
      opacity: 0.65,
    },

    headerText: {
      flex: 1,
    },

    titleRow: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 8,
    },

    title: {
      fontSize: 26,

      fontWeight: 'bold',

      color: colors.text,
    },

    subtitle: {
      marginTop: 5,

      color: colors.textMuted,

      lineHeight: 20,
    },

    errorText: {
      marginTop: 12,

      color: colors.error,
    },

    weatherContainer: {
      flex: 1,

      marginTop: 20,

      paddingBottom: 20,
    },
  });
}