import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  normalizeHex,
} from './colorUtils';

const ACCENT_COLOR_KEY =
  'justweather-accent-color';

export async function getStoredAccentColor():
  Promise<string | null> {
  try {
    const value =
      await AsyncStorage.getItem(
        ACCENT_COLOR_KEY
      );

    if (!value) {
      return null;
    }

    return normalizeHex(
      value
    );
  } catch (error) {
    console.error(
      'Failed to load accent color:',
      error
    );

    return null;
  }
}

export async function saveAccentColor(
  color: string
) {
  await AsyncStorage.setItem(
    ACCENT_COLOR_KEY,
    color
  );
}

export async function clearAccentColor() {
  await AsyncStorage.removeItem(
    ACCENT_COLOR_KEY
  );
}