import type {
  WidgetTaskHandlerProps,
} from 'react-native-android-widget';

import {
  CurrentWeatherWidget,
} from './components/CurrentWeatherWidget';

export async function widgetTaskHandler(
  props: WidgetTaskHandlerProps
) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      props.renderWidget(
        <CurrentWeatherWidget />
      );

      break;
    }

    case 'WIDGET_CLICK': {
      if (
        props.clickAction ===
        'REFRESH_WEATHER'
      ) {
        /*
         * For now this only proves that
         * the refresh click reaches our
         * JavaScript task handler.
         *
         * Next step:
         * fetch real Open-Meteo data here.
         */
        props.renderWidget(
          <CurrentWeatherWidget />
        );
      }

      break;
    }

    case 'WIDGET_DELETED':
      break;

    default:
      break;
  }
}