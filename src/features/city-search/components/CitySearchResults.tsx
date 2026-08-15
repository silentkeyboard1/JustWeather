import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { City } from '../model/city';

type CitySearchResultsProps = {
  cities: City[];
  onCitySelect: (city: City) => void;
};

export function CitySearchResults({
  cities,
  onCitySelect,
}: CitySearchResultsProps) {
  return (
    <View style={styles.results}>
      {cities.map((city) => (
        <Pressable
          key={city.id}
          style={styles.resultItem}
          onPress={() => onCitySelect(city)}
        >
          <Text style={styles.resultName}>
            {city.name}
          </Text>

          <Text>
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

const styles = StyleSheet.create({
  results: {
    marginTop: 24,
    gap: 12,
  },

  resultItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },

  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});