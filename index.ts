import 'expo-router/entry';

import {
  registerWidgetTaskHandler,
} from 'react-native-android-widget';

import {
  widgetTaskHandler,
} from './src/features/weather-widget/widgetTaskHandler';

registerWidgetTaskHandler(
  widgetTaskHandler
);