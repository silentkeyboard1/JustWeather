import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type CitySearchFormProps = {
  city: string;
  isLoading: boolean;
  onCityChange: (city: string) => void;
  onSearch: () => void;
};

export function CitySearchForm({
  city,
  isLoading,
  onCityChange,
  onSearch,
}: CitySearchFormProps) {
  return (
    <View>
      <Text style={styles.subtitle}>
        Suche nach einer Stadt
      </Text>

      <TextInput
        style={styles.input}
        placeholder="z.B. Berlin"
        value={city}
        onChangeText={onCityChange}
      />

      <Pressable
        style={[
          styles.button,
          isLoading && styles.buttonDisabled,
        ]}
        onPress={onSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Wetter suchen
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  button: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#222',
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});