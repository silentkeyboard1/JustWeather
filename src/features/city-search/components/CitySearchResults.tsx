import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { MapPin } from 'lucide-react-native';

import type { City } from '../model/city';

import type { AppColors } from '../../../shared/theme/theme';

import {
  useAppTheme,
} from '../../../shared/theme/theme';

type CitySearchResultsProps = {
  cities: City[];

  onCitySelect: (
    city: City
  ) => void;
};

export function CitySearchResults({
  cities,
  onCitySelect,
}: CitySearchResultsProps) {
  const { colors } =
    useAppTheme();

  const styles =
    createStyles(colors);

  return (
    <FlatList
      data={cities}
      keyExtractor={
        (city) => city.id
      }
      style={styles.list}
      contentContainerStyle={
        styles.listContent
      }
      showsVerticalScrollIndicator={
        false
      }
      keyboardShouldPersistTaps="handled"
      renderItem={({
        item: city,
      }) => (
        <Pressable
          style={({ pressed }) => [
            styles.cityCard,

            pressed &&
              styles.cityCardPressed,
          ]}
          onPress={() =>
            onCitySelect(city)
          }
          accessibilityRole="button"
          accessibilityLabel={`View weather for ${city.name}`}
        >
          <View
            style={
              styles.iconContainer
            }
          >
            <MapPin
              size={22}
              strokeWidth={2}
              color={
                colors.primary
              }
            />
          </View>

          <View
            style={
              styles.cityInfo
            }
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
              {formatLocation(
                city
              )}
            </Text>
          </View>
        </Pressable>
      )}
    />
  );
}

function formatLocation(
  city: City
) {
  const parts: string[] =
    [];

  if (
    city.region &&
    city.region
      .trim()
      .toLowerCase() !==
      city.name
        .trim()
        .toLowerCase()
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

  return parts.join(', ');
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    list: {
      flex: 1,
    },

    listContent: {
      gap: 10,

      paddingBottom: 24,
    },

    cityCard: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 12,

      minHeight: 72,

      paddingHorizontal: 14,

      paddingVertical: 12,

      borderRadius: 14,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    cityCardPressed: {
      opacity: 0.65,
    },

    iconContainer: {
      width: 42,

      height: 42,

      borderRadius: 21,

      alignItems: 'center',

      justifyContent:
        'center',

      backgroundColor:
        colors.surfaceSecondary,
    },

    cityInfo: {
      flex: 1,
    },

    cityName: {
      fontSize: 17,

      fontWeight: '700',

      color:
        colors.text,
    },

    cityLocation: {
      marginTop: 3,

      fontSize: 14,

      color:
        colors.textMuted,
    },
  });
}