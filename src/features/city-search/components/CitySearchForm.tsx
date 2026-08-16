import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Search,
} from 'lucide-react-native';

import {
  AppColors,
  useAppTheme,
} from '../../../shared/theme/theme';

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
  const { colors } = useAppTheme();

  const styles =
    createStyles(colors);

  return (
    <View>
      <Text style={styles.subtitle}>
        Suche nach einer Stadt
      </Text>

      <TextInput
        style={styles.input}
        placeholder="z.B. Berlin"
        placeholderTextColor={
          colors.textMuted
        }
        selectionColor={
          colors.primary
        }
        value={city}
        onChangeText={onCityChange}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />

      <Pressable
        style={[
          styles.button,

          isLoading &&
            styles.buttonDisabled,
        ]}
        onPress={onSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator
            color={colors.primaryText}
          />
        ) : (
          <View
            style={styles.buttonContent}
          >
            <Search
              size={18}
              color={colors.primaryText}
            />

            <Text
              style={styles.buttonText}
            >
              Wetter suchen
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    subtitle: {
      fontSize: 16,
      marginBottom: 24,
      color: colors.textMuted,
    },

    input: {
      borderWidth: 1,
      borderColor: colors.border,

      backgroundColor:
        colors.surface,

      color: colors.text,

      borderRadius: 10,

      padding: 12,

      fontSize: 16,

      marginBottom: 12,
    },

    button: {
      padding: 14,

      borderRadius: 10,

      backgroundColor:
        colors.primary,

      alignItems: 'center',
    },

    buttonDisabled: {
      opacity: 0.6,
    },

    buttonContent: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 8,
    },

    buttonText: {
      color: colors.primaryText,

      fontWeight: 'bold',
    },
  });
}