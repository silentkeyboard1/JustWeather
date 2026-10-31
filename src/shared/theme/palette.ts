import {
  clamp,
  getReadableTextColor,
  hexToOklch,
  normalizeHex,
  oklchToHex,
} from './colorUtils';

export type AppColors = {
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  icon: string;
  favorite: string;
  error: string;
  tabInactive: string;
};

/*
 * This is still the color shown by the
 * color picker after resetting.
 *
 * It was also the original JustWeather
 * primary color.
 */
export const DEFAULT_ACCENT_COLOR =
  '#527C96';

/*
 * ORIGINAL JUSTWEATHER THEME
 *
 * These values are returned exactly
 * when no custom accent was selected.
 */
export const DEFAULT_LIGHT_COLORS: AppColors = {
  background: '#F3F5F7',
  surface: '#FAFAF8',
  surfaceSecondary: '#EEF2F4',
  text: '#24313A',
  textMuted: '#687782',
  border: '#D5DCE1',
  primary: '#527C96',
  primaryText: '#F7FAFC',
  icon: '#53636E',
  favorite: '#D3A23E',
  error: '#B85C5C',
  tabInactive: '#7A8790',
};

export const DEFAULT_DARK_COLORS: AppColors = {
  background: '#111820',
  surface: '#1A232C',
  surfaceSecondary: '#222D37',
  text: '#E6EDF2',
  textMuted: '#A6B2BB',
  border: '#33404B',
  primary: '#7FA9C2',
  primaryText: '#101820',
  icon: '#B2BEC7',
  favorite: '#E1B85B',
  error: '#DF8585',
  tabInactive: '#7E8B95',
};

export function createThemeColors(
  customAccentHex: string | null,
  isDark: boolean
): AppColors {
  /*
   * No custom color:
   *
   * return the exact original JustWeather
   * theme instead of generating a tint.
   */
  if (!customAccentHex) {
    return isDark
      ? DEFAULT_DARK_COLORS
      : DEFAULT_LIGHT_COLORS;
  }

  const normalized =
    normalizeHex(
      customAccentHex
    );

  if (!normalized) {
    return isDark
      ? DEFAULT_DARK_COLORS
      : DEFAULT_LIGHT_COLORS;
  }

  const accent =
    hexToOklch(
      normalized
    );

  /*
   * Limit very aggressive user colors.
   *
   * #00FF00, #FF0000 etc. still determine
   * the hue, but they don't overwhelm
   * the complete interface.
   */
  const baseChroma =
    clamp(
      accent.c,
      0,
      0.16
    );

  return isDark
    ? createDarkColors(
        accent.h,
        baseChroma
      )
    : createLightColors(
        accent.h,
        baseChroma
      );
}

function createLightColors(
  hue: number,
  chroma: number
): AppColors {
  const primary =
    makeColor(
      0.58,
      chroma === 0
        ? 0
        : clamp(
            chroma,
            0.055,
            0.14
          ),
      hue,
      0.14
    );

  return {
    /*
     * Backgrounds receive only a small
     * amount of the selected hue.
     */
    background:
      makeColor(
        0.96,
        chroma * 0.14,
        hue,
        0.025
      ),

    surface:
      makeColor(
        0.985,
        chroma * 0.08,
        hue,
        0.018
      ),

    surfaceSecondary:
      makeColor(
        0.925,
        chroma * 0.22,
        hue,
        0.035
      ),

    text:
      makeColor(
        0.23,
        chroma * 0.07,
        hue,
        0.012
      ),

    textMuted:
      makeColor(
        0.49,
        chroma * 0.10,
        hue,
        0.018
      ),

    border:
      makeColor(
        0.84,
        chroma * 0.18,
        hue,
        0.028
      ),

    primary,

    primaryText:
      getReadableTextColor(
        primary
      ),

    icon:
      makeColor(
        0.40,
        chroma * 0.15,
        hue,
        0.025
      ),

    /*
     * Semantic colors remain semantic.
     */
    favorite:
      '#D3A23E',

    error:
      '#B85C5C',

    tabInactive:
      makeColor(
        0.53,
        chroma * 0.10,
        hue,
        0.018
      ),
  };
}

function createDarkColors(
  hue: number,
  chroma: number
): AppColors {
  const primary =
    makeColor(
      0.72,
      chroma === 0
        ? 0
        : clamp(
            chroma,
            0.06,
            0.15
          ),
      hue,
      0.15
    );

  return {
    background:
      makeColor(
        0.14,
        chroma * 0.10,
        hue,
        0.022
      ),

    surface:
      makeColor(
        0.19,
        chroma * 0.14,
        hue,
        0.028
      ),

    surfaceSecondary:
      makeColor(
        0.24,
        chroma * 0.22,
        hue,
        0.038
      ),

    text:
      makeColor(
        0.93,
        chroma * 0.04,
        hue,
        0.01
      ),

    textMuted:
      makeColor(
        0.70,
        chroma * 0.08,
        hue,
        0.016
      ),

    border:
      makeColor(
        0.32,
        chroma * 0.16,
        hue,
        0.028
      ),

    primary,

    primaryText:
      getReadableTextColor(
        primary
      ),

    icon:
      makeColor(
        0.77,
        chroma * 0.10,
        hue,
        0.018
      ),

    favorite:
      '#E1B85B',

    error:
      '#DF8585',

    tabInactive:
      makeColor(
        0.58,
        chroma * 0.08,
        hue,
        0.016
      ),
  };
}

function makeColor(
  lightness: number,
  chroma: number,
  hue: number,
  maxChroma = 0.04
) {
  return oklchToHex({
    l:
      lightness,

    c:
      Math.min(
        chroma,
        maxChroma
      ),

    h:
      hue,
  });
}