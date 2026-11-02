import {
  useEffect,
  useState,
} from 'react';

import {
  router,
} from 'expo-router';

import {
  ArrowLeft,
  RotateCcw,
} from 'lucide-react-native';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ScrollView,
} from 'react-native-gesture-handler';

import ColorPicker, {
  HueSlider,
  Panel1,
  type ColorFormatsObject,
} from 'reanimated-color-picker';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {
  normalizeHex,
} from '../shared/theme/colorUtils';

import type {
  AppColors,
} from '../shared/theme/theme';

import {
  DEFAULT_ACCENT_COLOR,
  useAppTheme,
} from '../shared/theme/theme';

import {
  updateAllWeatherWidgets,
} from '../features/weather-widget/updateAllWeatherWidgets';

export default function SettingsScreen() {
  const insets =
    useSafeAreaInsets();

  const {
    colors,
    accentColor,
    setAccentColor,
    resetAccentColor,
  } =
    useAppTheme();

  const [
    hexInput,
    setHexInput,
  ] =
    useState(
      accentColor
    );

  const [
    inputError,
    setInputError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const styles =
    createStyles(
      colors
    );

  useEffect(() => {
    setHexInput(
      accentColor
    );
  }, [
    accentColor,
  ]);

  function handlePickerColor(
  color:
    ColorFormatsObject
) {
  const normalized =
    normalizeHex(
      color.hex
    );

  if (!normalized) {
    return;
  }

  setInputError(
    null
  );

  setHexInput(
    normalized
  );

  void applyThemeColor(
    normalized
  );
}

async function applyThemeColor(
  color: string
) {
  /*
   * Save/update application first.
   */
  await setAccentColor(
    color
  );

  /*
   * Then immediately repaint all
   * installed Android widgets.
   */
  await updateAllWeatherWidgets();
}

async function handleApplyHex() {
  const normalized =
    normalizeHex(
      hexInput
    );

  if (!normalized) {
    setInputError(
      'Enter a valid HEX color, for example #527C96.'
    );

    return;
  }

  setInputError(
    null
  );

  setHexInput(
    normalized
  );

  await applyThemeColor(
    normalized
  );
}

async function handleReset() {
  setInputError(
    null
  );

  setHexInput(
    DEFAULT_ACCENT_COLOR
  );

  /*
   * This removes the custom color from
   * storage and restores the original
   * static JustWeather palette.
   */
  await resetAccentColor();

  /*
   * Restore widgets to their original
   * gray palette immediately as well.
   */
  await updateAllWeatherWidgets();
}

  return (
    <KeyboardAvoidingView
      style={
        styles.screen
      }
      behavior={
        Platform.OS ===
        'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop:
              insets.top +
              10,

            paddingBottom:
              insets.bottom +
              30,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={
          false
        }
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
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <ArrowLeft
              size={25}
              color={
                colors.text
              }
            />
          </Pressable>

          <Text
            style={
              styles.title
            }
          >
            Settings
          </Text>

          <View
            style={
              styles.headerSpacer
            }
          />
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Appearance
        </Text>

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.label
            }
          >
            Theme color
          </Text>

          <Text
            style={
              styles.description
            }
          >
            Choose a base color. The app theme will use it as tint for the app theme.
          </Text>

          {/* COLOR PICKER */}

          <ColorPicker
            value={
              accentColor
            }
            onCompleteJS={
              handlePickerColor
            }
            boundedThumb
            thumbSize={
              26
            }
            sliderThickness={
              22
            }
            style={
              styles.picker
            }
          >
            <Panel1
              style={
                styles.colorPanel
              }
            />

            <HueSlider
              style={
                styles.hueSlider
              }
            />
          </ColorPicker>

          {/* HEX */}

          <Text
            style={[
              styles.label,
              styles.hexLabel,
            ]}
          >
            HEX color
          </Text>

          <View
            style={
              styles.hexRow
            }
          >
            <View
              style={[
                styles.colorPreview,

                {
                  backgroundColor:
                    accentColor,
                },
              ]}
            />

            <TextInput
              value={
                hexInput
              }
              onChangeText={
                value => {
                  setHexInput(
                    value
                      .toUpperCase()
                  );

                  setInputError(
                    null
                  );
                }
              }
              onSubmitEditing={
                handleApplyHex
              }
              maxLength={
                7
              }
              autoCapitalize="characters"
              autoCorrect={
                false
              }
              returnKeyType="done"
              placeholder="#527C96"
              placeholderTextColor={
                colors.textMuted
              }
              style={
                styles.hexInput
              }
              accessibilityLabel="HEX theme color"
            />

            
          </View>

          {inputError && (
            <Text
              style={
                styles.errorText
              }
            >
              {inputError}
            </Text>
          )}
        </View>

        {/* PREVIEW */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Preview
        </Text>

        <View
          style={
            styles.preview
          }
        >
          <View>
            <Text
              style={
                styles.previewCity
              }
            >
              JustWeather
            </Text>

            <Text
              style={
                styles.previewMuted
              }
            >
              Your theme
            </Text>
          </View>

          <View
            style={
              styles.previewTemperatureContainer
            }
          >
            <Text
              style={
                styles.previewTemperature
              }
            >
              18°
            </Text>

            <View
              style={
                styles.previewAccentDot
              }
            />
          </View>

          <View
            style={
              styles.previewSurface
            }
          >
            <View
              style={
                styles.previewLine
              }
            />

            <View
              style={
                styles.previewLine
              }
            />

            <View
              style={
                styles.previewLine
              }
            />
          </View>
        </View>

        <Pressable
          style={({
            pressed,
          }) => [
            styles.resetButton,

            pressed &&
              styles.buttonPressed,
          ]}
          onPress={
            handleReset
          }
          accessibilityRole="button"
        >
          <RotateCcw
            size={18}
            color={
              colors.text
            }
          />

          <Text
            style={
              styles.resetText
            }
          >
            Reset to default
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(
  colors: AppColors
) {
  return StyleSheet.create({
    screen: {
      flex: 1,

      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal:
        20,
    },

    header: {
      minHeight: 50,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 24,
    },

    backButton: {
      width: 44,

      height: 44,

      alignItems:
        'center',

      justifyContent:
        'center',

      borderRadius: 22,

      backgroundColor:
        colors.surface,
    },

    buttonPressed: {
      opacity: 0.65,

      transform: [
        {
          scale: 0.96,
        },
      ],
    },

    title: {
      color:
        colors.text,

      fontSize: 20,

      fontWeight:
        '800',
    },

    headerSpacer: {
      width: 44,
    },

    sectionTitle: {
      marginBottom: 10,

      color:
        colors.text,

      fontSize: 15,

      fontWeight:
        '700',
    },

    card: {
      padding: 18,

      borderRadius: 22,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,

      marginBottom: 28,
    },

    label: {
      color:
        colors.text,

      fontSize: 15,

      fontWeight:
        '700',
    },

    description: {
      marginTop: 5,

      marginBottom: 20,

      color:
        colors.textMuted,

      fontSize: 12,

      lineHeight: 18,
    },

    picker: {
      width:
        '100%',

      gap: 16,
    },

    colorPanel: {
      height: 220,

      borderRadius: 18,
    },

    hueSlider: {
      borderRadius: 20,
    },

    hexLabel: {
      marginTop: 24,

      marginBottom: 9,
    },

    hexRow: {
      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 8,
    },

    colorPreview: {
      width: 42,

      height: 42,

      borderRadius: 12,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    hexInput: {
      flex: 1,

      height: 46,

      paddingHorizontal:
        13,

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: 14,

      backgroundColor:
        colors.surfaceSecondary,

      color:
        colors.text,

      fontSize: 15,

      fontWeight:
        '600',

      letterSpacing: 0.5,
    },

    applyButton: {
      minHeight: 46,

      justifyContent:
        'center',

      paddingHorizontal:
        15,

      borderRadius: 14,

      backgroundColor:
        colors.primary,
    },

    applyButtonText: {
      color:
        colors.primaryText,

      fontSize: 13,

      fontWeight:
        '700',
    },

    errorText: {
      marginTop: 8,

      color:
        colors.error,

      fontSize: 12,

      lineHeight: 17,
    },

    preview: {
      padding: 18,

      marginBottom: 14,

      borderRadius: 22,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border,
    },

    previewCity: {
      color:
        colors.text,

      fontSize: 18,

      fontWeight:
        '800',
    },

    previewMuted: {
      marginTop: 2,

      color:
        colors.textMuted,

      fontSize: 11,
    },

    previewTemperatureContainer: {
      marginTop: 20,

      flexDirection:
        'row',

      alignItems:
        'center',

      gap: 10,
    },

    previewTemperature: {
      color:
        colors.text,

      fontSize: 48,

      fontWeight:
        '800',
    },

    previewAccentDot: {
      width: 14,

      height: 14,

      borderRadius: 7,

      backgroundColor:
        colors.primary,
    },

    previewSurface: {
      marginTop: 16,

      minHeight: 60,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'space-evenly',

      borderRadius: 17,

      backgroundColor:
        colors.surfaceSecondary,
    },

    previewLine: {
      width: 44,

      height: 8,

      borderRadius: 4,

      backgroundColor:
        colors.border,
    },

    resetButton: {
      minHeight: 50,

      flexDirection:
        'row',

      alignItems:
        'center',

      justifyContent:
        'center',

      gap: 8,

      borderRadius: 18,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surface,
    },

    resetText: {
      color:
        colors.text,

      fontSize: 14,

      fontWeight:
        '700',
    },
  });
}