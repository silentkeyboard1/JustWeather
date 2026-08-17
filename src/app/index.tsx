import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { router } from "expo-router";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { LocateFixed, RefreshCw, Search } from "lucide-react-native";

import type { City } from "../features/city-search/model/city";

import { useFavorites } from "../features/favorites/context/FavoritesContext";

import { getCurrentCity } from "../features/location/api/getCurrentCity";

import { WeatherPage } from "../features/weather/components/WeatherPage";

import type { AppColors } from "../shared/theme/theme";

import { useAppTheme } from "../shared/theme/theme";

export default function HomeScreen() {
  const { width } = useWindowDimensions();

  const { colors } = useAppTheme();

  const styles = createStyles(colors);

  const pagerRef = useRef<FlatList<City>>(null);

  const { favoriteCities, isFavorite, toggleFavorite } = useFavorites();

  const [currentCity, setCurrentCity] = useState<City | null>(null);

  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const [locationError, setLocationError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Unsere Swipe-Seiten.
   *
   * 0 = aktueller Standort
   * danach alle Favoriten
   */
  const weatherCities = useMemo(() => {
    if (currentCity) {
      return [currentCity, ...favoriteCities];
    }

    return favoriteCities;
  }, [currentCity, favoriteCities]);

  const loadCurrentLocation = useCallback(async () => {
    setIsLoadingLocation(true);

    setLocationError(null);

    try {
      const city = await getCurrentCity();

      setCurrentCity(city);
    } catch (error) {
      console.error("Standort konnte nicht geladen werden:", error);

      if (
        error instanceof Error &&
        error.message === "LOCATION_PERMISSION_DENIED"
      ) {
        setLocationError(
          "Ohne Standortberechtigung kann das Wetter für deinen aktuellen Standort nicht angezeigt werden.",
        );
      } else {
        setLocationError(
          "Dein aktueller Standort konnte nicht ermittelt werden.",
        );
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  /**
   * Standort beim Start laden.
   */
  useEffect(() => {
    void loadCurrentLocation();
  }, [loadCurrentLocation]);

  /**
   * Falls ein Favorit gelöscht wird und
   * dadurch die aktuelle Seite nicht
   * mehr existiert:
   *
   * zurück auf Seite 0.
   */
  useEffect(() => {
    if (activeIndex < weatherCities.length) {
      return;
    }

    setActiveIndex(0);

    pagerRef.current?.scrollToIndex({
      index: 0,
      animated: true,
    });
  }, [activeIndex, weatherCities.length]);

  async function handleToggleFavorite(city: City) {
    if (city.id === "current-location") {
      return;
    }

    const wasFavorite = isFavorite(city.id);

    await toggleFavorite(city);

    /**
     * Wird die aktuell sichtbare
     * Favoriten-Seite gelöscht,
     * springen wir zum Standort.
     */
    if (wasFavorite && currentCity) {
      setActiveIndex(0);

      pagerRef.current?.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  }

  function handlePageChanged(offsetX: number) {
    const newIndex = Math.round(offsetX / width);

    setActiveIndex(newIndex);
  }

  function handleRetryLocation() {
    void loadCurrentLocation();
  }

  const hasPages = weatherCities.length > 0;

  return (
    <View style={styles.container}>
      {/* LOCATION LOADING */}
      {isLoadingLocation && !hasPages && (
        <View style={styles.center}>
          <ActivityIndicator size='large' color={colors.primary} />

          <Text style={styles.mutedText}>Standort wird ermittelt...</Text>
        </View>
      )}

      {/* KEIN STANDORT + KEINE FAVORITEN */}
      {locationError && !hasPages && (
        <View style={styles.errorContainer}>
          <LocateFixed size={42} color={colors.error} />

          <Text style={styles.errorTitle}>Standort nicht verfügbar</Text>

          <Text style={styles.errorText}>{locationError}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.retryButton,

              pressed && styles.retryButtonPressed,
            ]}
            onPress={handleRetryLocation}
          >
            <RefreshCw size={18} color={colors.primaryText} />

            <Text style={styles.retryButtonText}>Erneut versuchen</Text>
          </Pressable>
        </View>
      )}

      {/* STANDORT FEHLT, ABER FAVORITEN SIND DA */}
      {locationError && hasPages && (
        <View style={styles.locationWarning}>
          <Text style={styles.locationWarningText}>
            Standort aktuell nicht verfügbar.
          </Text>

          <Pressable onPress={handleRetryLocation} hitSlop={8}>
            <RefreshCw size={18} color={colors.primary} />
          </Pressable>
        </View>
      )}

      {/* WETTER-SEITEN */}
      {hasPages && (
        <FlatList
          ref={pagerRef}
          data={weatherCities}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(city) => city.id}
          style={styles.pager}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={(event) => {
            handlePageChanged(event.nativeEvent.contentOffset.x);
          }}
          renderItem={({ item: city }) => {
            const isCurrentLocation = city.id === "current-location";

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
                  isCurrentLocation={isCurrentLocation}
                  isFavorite={isCurrentLocation ? false : isFavorite(city.id)}
                  onToggleFavorite={handleToggleFavorite}
                  useWeatherBackground
                />
              </View>
            );
          }}
        />
      )}

      {/* PAGINATION DOTS */}
      {weatherCities.length > 1 && (
        <View style={styles.pagination} pointerEvents='none'>
          {weatherCities.map((city, index) => (
            <View
              key={city.id}
              style={[styles.dot, index === activeIndex && styles.activeDot]}
            />
          ))}
        </View>
      )}

      {/* FLOATING SEARCH BUTTON */}
      <Pressable
        style={({ pressed }) => [
          styles.searchFab,

          pressed && styles.searchFabPressed,
        ]}
        onPress={() => router.push("/search")}
        accessibilityRole='button'
        accessibilityLabel='Stadt suchen'
      >
        <Search size={27} color={colors.primaryText} />
      </Pressable>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,

      backgroundColor: colors.background,
    },

    pager: {
      flex: 1,
    },

    page: {
      flex: 1,
    },

    center: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      gap: 12,

      paddingHorizontal: 24,
    },

    mutedText: {
      color: colors.textMuted,
    },

    errorContainer: {
      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      paddingHorizontal: 24,

      gap: 12,
    },

    errorTitle: {
      fontSize: 20,

      fontWeight: "bold",

      color: colors.text,
    },

    errorText: {
      color: colors.textMuted,

      textAlign: "center",

      lineHeight: 21,
    },

    retryButton: {
      flexDirection: "row",

      alignItems: "center",

      gap: 8,

      marginTop: 8,

      paddingHorizontal: 18,

      paddingVertical: 12,

      borderRadius: 10,

      backgroundColor: colors.primary,
    },

    retryButtonPressed: {
      opacity: 0.75,
    },

    retryButtonText: {
      color: colors.primaryText,

      fontWeight: "600",
    },

    locationWarning: {
      position: "absolute",

      top: 18,

      left: 20,

      right: 20,

      zIndex: 50,

      elevation: 5,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "space-between",

      paddingHorizontal: 14,

      paddingVertical: 10,

      borderWidth: 1,

      borderColor: colors.border,

      borderRadius: 12,

      backgroundColor: colors.surface,
    },

    locationWarningText: {
      color: colors.textMuted,
    },

    pagination: {
      position: "absolute",

      bottom: 30,

      left: 0,

      right: 0,

      flexDirection: "row",

      justifyContent: "center",

      alignItems: "center",

      gap: 7,

      zIndex: 20,
    },

    dot: {
      width: 7,

      height: 7,

      borderRadius: 4,

      backgroundColor: colors.border,
    },

    activeDot: {
      width: 18,

      backgroundColor: colors.primary,
    },

    searchFab: {
      position: "absolute",

      left: 20,

      bottom: 20,

      width: 60,

      height: 60,

      borderRadius: 30,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor: colors.primary,

      zIndex: 100,

      elevation: 12,

      shadowColor: colors.text,

      shadowOffset: {
        width: 0,
        height: 5,
      },

      shadowOpacity: 0.2,

      shadowRadius: 8,
    },

    searchFabPressed: {
      opacity: 0.8,

      transform: [
        {
          scale: 0.95,
        },
      ],
    },
  });
}
