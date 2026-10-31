import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useColorScheme,
} from 'react-native';

import {
  normalizeHex,
} from './colorUtils';

import {
  createThemeColors,
  DEFAULT_ACCENT_COLOR,
  type AppColors,
} from './palette';

import {
  clearAccentColor,
  getStoredAccentColor,
  saveAccentColor,
} from './themeStorage';

export type {
  AppColors,
};

export {
  DEFAULT_ACCENT_COLOR,
};

type AppThemeContextValue = {
  colors: AppColors;

  isDark: boolean;

  /*
   * Always a usable HEX value for
   * displaying inside the picker/input.
   */
  accentColor: string;

  /*
   * null = original JustWeather theme.
   */
  customAccentColor:
    string | null;

  setAccentColor: (
    color: string
  ) => Promise<void>;

  resetAccentColor:
    () => Promise<void>;
};

const AppThemeContext =
  createContext<
    AppThemeContextValue | undefined
  >(undefined);

type AppThemeProviderProps = {
  children: ReactNode;
};

export function AppThemeProvider({
  children,
}: AppThemeProviderProps) {
  const colorScheme =
    useColorScheme();

  const isDark =
    colorScheme ===
    'dark';

  /*
   * null is intentional.
   *
   * It means:
   * "Use the original neutral theme."
   */
  const [
    customAccentColor,
    setCustomAccentColor,
  ] =
    useState<
      string | null
    >(
      null
    );

  useEffect(() => {
    void loadStoredColor();
  }, []);

  async function loadStoredColor() {
    const storedColor =
      await getStoredAccentColor();

    if (storedColor) {
      setCustomAccentColor(
        storedColor
      );
    }
  }

  const setAccentColor =
    useCallback(
      async (
        color: string
      ) => {
        const normalized =
          normalizeHex(
            color
          );

        if (!normalized) {
          return;
        }

        /*
         * Immediate React update.
         */
        setCustomAccentColor(
          normalized
        );

        try {
          await saveAccentColor(
            normalized
          );
        } catch (error) {
          console.error(
            'Failed to save accent color:',
            error
          );
        }
      },
      []
    );

  const resetAccentColor =
    useCallback(
      async () => {
        /*
         * null makes createThemeColors()
         * return the original static palette.
         */
        setCustomAccentColor(
          null
        );

        try {
          await clearAccentColor();
        } catch (error) {
          console.error(
            'Failed to reset accent color:',
            error
          );
        }
      },
      []
    );

  const colors =
    useMemo(
      () =>
        createThemeColors(
          customAccentColor,
          isDark
        ),
      [
        customAccentColor,
        isDark,
      ]
    );

  /*
   * The picker still needs a color to show.
   *
   * When we're using the original theme,
   * show its original primary color.
   */
  const accentColor =
    customAccentColor ??
    DEFAULT_ACCENT_COLOR;

  const value =
    useMemo(
      () => ({
        colors,
        isDark,
        accentColor,
        customAccentColor,
        setAccentColor,
        resetAccentColor,
      }),
      [
        colors,
        isDark,
        accentColor,
        customAccentColor,
        setAccentColor,
        resetAccentColor,
      ]
    );

  return (
    <AppThemeContext.Provider
      value={
        value
      }
    >
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context =
    useContext(
      AppThemeContext
    );

  if (!context) {
    throw new Error(
      'useAppTheme must be used inside AppThemeProvider.'
    );
  }

  return context;
}