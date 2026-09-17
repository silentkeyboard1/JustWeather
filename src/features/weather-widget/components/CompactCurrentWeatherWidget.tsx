'use no memo';

import {
  FlexWidget,
  SvgWidget,
  TextWidget,
} from 'react-native-android-widget';

import type {
  ColorProp,
} from 'react-native-android-widget';

import type {
  City,
} from '../../city-search/model/city';

import type {
  Weather,
} from '../../weather/model/weather';

import {
  getWeatherCondition,
} from '../../weather/utils/getWeatherCondition';

import {
  getRefreshIconSvg,
  getWidgetWeatherIconSvg,
} from '../utils/getWidgetWeatherIconSvg';

type WidgetTheme =
  | 'light'
  | 'dark';

type CompactCurrentWeatherWidgetProps = {
  theme: WidgetTheme;

  city: City | null;

  weather: Weather | null;

  message?: string;
};

export function CompactCurrentWeatherWidget({
  theme,
  city,
  weather,
  message,
}: CompactCurrentWeatherWidgetProps) {
  const isDark =
    theme === 'dark';

  /*
   * Same colors as the 2x4 widget.
   */
  const backgroundColor: ColorProp =
    isDark
      ? '#202124'
      : '#F1F3F4';

  const textColor: ColorProp =
    isDark
      ? '#F1F3F4'
      : '#202124';

  const secondaryTextColor: ColorProp =
    isDark
      ? '#BDC1C6'
      : '#5F6368';

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  /*
   * 1x4 is intentionally much simpler.
   *
   * There is not enough vertical space
   * for the hourly forecast pill.
   *
   * Layout:
   *
   * London        20°   cloud   refresh
   * Overcast
   */
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel="Open JustWeather"
      style={{
        width:
          'match_parent',

        height:
          'match_parent',

        paddingHorizontal:
          14,

        paddingVertical:
          9,

        borderRadius:
          22,

        backgroundColor,

        flexDirection:
          'row',

        alignItems:
          'center',

        justifyContent:
          'space-between',
      }}
    >
      {/* CITY + CONDITION */}

      <FlexWidget
        style={{
          width: 115,

          flexDirection:
            'column',

          justifyContent:
            'center',
        }}
      >
        <TextWidget
          text={
            shortenCityName(
              city?.name ??
                'JustWeather'
            )
          }
          style={{
            fontSize:
              14,

            fontWeight:
              '700',

            color:
              textColor,
          }}
        />

        <TextWidget
          text={
            weather &&
            currentCondition
              ? currentCondition.label
              : message
                ? shortenMessage(
                    message
                  )
                : 'Weather'
          }
          style={{
            marginTop:
              2,

            fontSize:
              9,

            fontWeight:
              '600',

            color:
              secondaryTextColor,
          }}
        />
      </FlexWidget>

      {/* WEATHER */}

      {weather &&
      currentCondition ? (
        <FlexWidget
          style={{
            flexDirection:
              'row',

            alignItems:
              'center',
          }}
        >
          {/* TEMPERATURE */}

          <TextWidget
            text={`${Math.round(
              weather.current
                .temperature
            )}°`}
            style={{
              fontSize:
                27,

              fontWeight:
                '800',

              color:
                textColor,
            }}
          />

          {/* WEATHER ICON */}

          <SvgWidget
            svg={
              getWidgetWeatherIconSvg(
                currentCondition.icon,
                textColor
              )
            }
            style={{
              width: 27,

              height: 27,

              marginLeft:
                10,
            }}
          />

          {/* REFRESH */}

          <SvgWidget
            svg={
              getRefreshIconSvg(
                secondaryTextColor
              )
            }
            clickAction="REFRESH_WEATHER"
            accessibilityLabel="Refresh weather"
            style={{
              width: 22,

              height: 22,

              marginLeft:
                12,

              padding: 3,
            }}
          />
        </FlexWidget>
      ) : (
        <SvgWidget
          svg={
            getRefreshIconSvg(
              secondaryTextColor
            )
          }
          clickAction="REFRESH_WEATHER"
          accessibilityLabel="Refresh weather"
          style={{
            width: 22,

            height: 22,

            padding: 3,
          }}
        />
      )}
    </FlexWidget>
  );
}

function shortenCityName(
  name: string
) {
  const maxLength =
    15;

  if (
    name.length <=
    maxLength
  ) {
    return name;
  }

  return `${name.slice(
    0,
    maxLength - 1
  )}…`;
}

function shortenMessage(
  message: string
) {
  if (
    message.includes(
      'Open JustWeather'
    )
  ) {
    return 'Open app to set location';
  }

  if (
    message.includes(
      'Weather unavailable'
    )
  ) {
    return 'Weather unavailable';
  }

  if (
    message.includes(
      'location'
    )
  ) {
    return 'Location unavailable';
  }

  return 'Weather unavailable';
}