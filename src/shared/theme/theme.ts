import { useColorScheme } from 'react-native';

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

const lightColors: AppColors = {
  background: '#F3F5F7',

  surface: '#FAFAF8',

  surfaceSecondary: '#EEF2F4',

  text: '#24313A',

  textMuted: '#687782',

  border: '#D5DCE1',

  primary: '#302F2C',

  primaryText: '#F7FAFC',

  icon: '#53636E',

  favorite: '#D3A23E',

  error: '#B85C5C',

  tabInactive: '#7A8790',
};

const darkColors: AppColors = {
  background: '#111820',

  surface: '#1A232C',

  surfaceSecondary: '#222D37',

  text: '#E6EDF2',

  textMuted: '#A6B2BB',

  border: '#33404B',

  primary: '#F4F5F7',

  primaryText: '#101820',

  icon: '#F4F5F7',

  favorite: '#E1B85B',

  error: '#DF8585',

  tabInactive: '#7E8B95',
};

export function useAppTheme() {
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: isDark
      ? darkColors
      : lightColors,
  };
}