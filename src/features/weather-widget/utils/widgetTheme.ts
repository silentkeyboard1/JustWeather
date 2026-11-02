import type {
  ColorProp,
} from 'react-native-android-widget';

import {
  createThemeColors,
} from '../../../shared/theme/palette';

type WidgetTheme =
  | 'light'
  | 'dark';

type WidgetThemeColors = {
  backgroundColor:
    ColorProp;

  textColor:
    ColorProp;

  secondaryTextColor:
    ColorProp;

  hourlyBackgroundColor:
    ColorProp;

  primaryColor:
    ColorProp;
};

/*
 * The widget task loads this value from
 * AsyncStorage before rendering.
 *
 * null means original widget styling.
 */
let currentAccentColor:
  string | null =
  null;

export function setWidgetAccentColor(
  color: string | null
) {
  currentAccentColor =
    color;
}

export function getWidgetThemeColors(
  theme: WidgetTheme
): WidgetThemeColors {
  const isDark =
    theme ===
    'dark';

  /*
   * ORIGINAL WIDGET COLORS
   *
   * Reset goes back to exactly this.
   */
  if (!currentAccentColor) {
    return isDark
      ? {
          backgroundColor:
            '#202124',

          textColor:
            '#F1F3F4',

          secondaryTextColor:
            '#BDC1C6',

          hourlyBackgroundColor:
            '#2B2C2F',

          primaryColor:
            '#7FA9C2',
        }
      : {
          backgroundColor:
            '#F1F3F4',

          textColor:
            '#202124',

          secondaryTextColor:
            '#5F6368',

          hourlyBackgroundColor:
            '#E3E5E8',

          primaryColor:
            '#527C96',
        };
  }

  const colors =
    createThemeColors(
      currentAccentColor,
      isDark
    );

  return {
    backgroundColor:
      asWidgetColor(
        colors.surface
      ),

    textColor:
      asWidgetColor(
        colors.text
      ),

    secondaryTextColor:
      asWidgetColor(
        colors.textMuted
      ),

    hourlyBackgroundColor:
      asWidgetColor(
        colors.surfaceSecondary
      ),

    primaryColor:
      asWidgetColor(
        colors.primary
      ),
  };
}

function asWidgetColor(
  color: string
): ColorProp {
  return color as ColorProp;
}