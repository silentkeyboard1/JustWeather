import {
  useRouter,
} from 'expo-router';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  MapPin,
  Star,
} from 'lucide-react-native';

import type { City } from '../features/city-search/model/city';

import { useFavorites } from '../features/favorites/context/FavoritesContext';

import {
  AppColors,
  useAppTheme,
} from '../shared/theme/theme';

export default function FavoritesScreen() {
  const router =
    useRouter();

  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  const {
    favoriteCities,
    isLoadingFavorites,
    removeFavorite,
  } = useFavorites();

  function handleCityPress(
    city: City
  ) {
    router.navigate({
      pathname: '/',

      params: {
        cityId: city.id,
      },
    });
  }

  if (isLoadingFavorites) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          color={colors.primary}
        />

        <Text
          style={styles.loadingText}
        >
          Favoriten werden geladen...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Favoriten
      </Text>

      <FlatList
        data={favoriteCities}
        keyExtractor={
          (city) => city.id
        }
        contentContainerStyle={
          styles.listContent
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Star
              size={44}
              color={
                colors.textMuted
              }
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              Noch keine Favoriten
            </Text>

            <Text
              style={
                styles.emptyText
              }
            >
              Suche im Wetter-Tab
              nach einer Stadt und
              tippe auf den Stern.
            </Text>
          </View>
        }
        renderItem={({
          item: city,
        }) => (
          <View
            style={
              styles.favoriteItem
            }
          >
            <Pressable
              style={({ pressed }) => [
                styles.cityButton,

                pressed &&
                  styles.cityButtonPressed,
              ]}
              onPress={() =>
                handleCityPress(city)
              }
            >
              <View
                style={
                  styles.cityHeader
                }
              >
                <MapPin
                  size={20}
                  color={colors.icon}
                />

                <View
                  style={
                    styles.cityInfo
                  }
                >
                  <Text
                    style={
                      styles.cityName
                    }
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
              </View>
            </Pressable>

            <Pressable
              style={
                styles.removeButton
              }
              onPress={() =>
                void removeFavorite(
                  city.id
                )
              }
              hitSlop={8}
            >
              <Star
                size={27}
                color={
                  colors.favorite
                }
                fill={
                  colors.favorite
                }
              />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    container: {
      flex: 1,

      padding: 24,

      backgroundColor:
        colors.background,
    },

    title: {
      fontSize: 32,

      fontWeight: 'bold',

      marginBottom: 24,

      color: colors.text,
    },

    listContent: {
      gap: 12,
    },

    favoriteItem: {
      flexDirection: 'row',

      alignItems: 'center',

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surface,

      borderRadius: 12,

      overflow: 'hidden',
    },

    cityButton: {
      flex: 1,

      padding: 16,
    },

    cityButtonPressed: {
      backgroundColor:
        colors.surfaceSecondary,
    },

    cityHeader: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 12,
    },

    cityInfo: {
      flex: 1,
    },

    cityName: {
      fontSize: 18,

      fontWeight: 'bold',

      color: colors.text,
    },

    cityLocation: {
      marginTop: 4,

      color: colors.textMuted,
    },

    removeButton: {
      padding: 16,
    },

    empty: {
      alignItems: 'center',

      paddingTop: 80,

      gap: 8,
    },

    emptyTitle: {
      fontSize: 20,

      fontWeight: 'bold',

      color: colors.text,
    },

    emptyText: {
      textAlign: 'center',

      color: colors.textMuted,
    },

    center: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      gap: 12,

      backgroundColor:
        colors.background,
    },

    loadingText: {
      color: colors.textMuted,
    },
  });
}