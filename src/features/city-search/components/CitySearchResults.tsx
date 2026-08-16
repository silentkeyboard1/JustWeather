import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { City } from '../model/city';

import {
  AppColors,
  useAppTheme,
} from '../../../shared/theme/theme';

type CitySearchResultsProps = {
  cities: City[];
  onCitySelect: (city: City) => void;
};

export function CitySearchResults({
  cities,
  onCitySelect,
}: CitySearchResultsProps) {
  const { colors } = useAppTheme();

  const styles =
    createStyles(colors);

  return (
    <View style={styles.results}>
      {cities.map((city) => (
        <Pressable
          key={city.id}
          style={({ pressed }) => [
            styles.resultItem,

            pressed &&
              styles.resultItemPressed,
          ]}
          onPress={() =>
            onCitySelect(city)
          }
        >
          <Text
            style={styles.resultName}
          >
            {city.name}
          </Text>

          <Text
            style={
              styles.resultLocation
            }
          >
            {city.region
              ? `${city.region}, `
              : ''}

            {city.country}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    results: {
      marginTop: 24,
      gap: 12,
    },

    resultItem: {
      padding: 16,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surface,

      borderRadius: 10,
    },

    resultItemPressed: {
      backgroundColor:
        colors.surfaceSecondary,
    },

    resultName: {
      fontSize: 18,

      fontWeight: 'bold',

      color: colors.text,
    },

    resultLocation: {
      marginTop: 4,

      color: colors.textMuted,
    },
  });
}