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

type SquareCurrentWeatherWidgetProps = {
  theme: WidgetTheme;

  city: City | null;

  weather: Weather | null;

  message?: string;
};

export function SquareCurrentWeatherWidget({
  theme,
  city,
  weather,
  message,
}: SquareCurrentWeatherWidgetProps) {
  const isDark =
    theme === 'dark';

  /*
   * Same colors as the other
   * JustWeather widgets.
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

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel="Open JustWeather"
      style={{
        width:
          'match_parent',

        height:
          'match_parent',

        padding: 12,

        borderRadius: 22,

        backgroundColor,

        flexDirection:
          'column',

        justifyContent:
          'space-between',
      }}
    >
      {/* HEADER */}

      <FlexWidget
        style={{
          width:
            'match_parent',

          flexDirection:
            'row',

          alignItems:
            'center',

          justifyContent:
            'space-between',
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
            fontSize: 13,

            fontWeight:
              '700',

            color:
              textColor,
          }}
        />

        <SvgWidget
          svg={
            getRefreshIconSvg(
              secondaryTextColor
            )
          }
          clickAction="REFRESH_WEATHER"
          accessibilityLabel="Refresh weather"
          style={{
            width: 20,

            height: 20,

            padding: 3,
          }}
        />
      </FlexWidget>

      {/* NO WEATHER */}

      {!weather ? (
        <FlexWidget
          style={{
            width:
              'match_parent',

            height:
              'match_parent',

            alignItems:
              'center',

            justifyContent:
              'center',

            paddingHorizontal:
              4,
          }}
        >
          <TextWidget
            text={
              getShortMessage(
                message
              )
            }
            style={{
              fontSize: 10,

              fontWeight:
                '600',

              color:
                secondaryTextColor,

              textAlign:
                'center',
            }}
          />
        </FlexWidget>
      ) : (
        <FlexWidget
          style={{
            width:
              'match_parent',

            flexDirection:
              'column',

            marginTop: 5,
          }}
        >
          {/* TEMPERATURE + ICON */}

          <FlexWidget
            style={{
              width:
                'match_parent',

              flexDirection:
                'row',

              alignItems:
                'center',

              justifyContent:
                'space-between',
            }}
          >
            <TextWidget
              text={`${Math.round(
                weather.current
                  .temperature
              )}°`}
              style={{
                fontSize: 34,

                fontWeight:
                  '800',

                color:
                  textColor,
              }}
            />

            {currentCondition ? (
              <SvgWidget
                svg={
                  getWidgetWeatherIconSvg(
                    currentCondition.icon,
                    textColor
                  )
                }
                style={{
                  width: 36,
                  height: 36,
                  marginTop: 1,
                }}
              />
            ) : (
              <FlexWidget />
            )}
          </FlexWidget>

          {/* CONDITION */}

          {currentCondition && (
            <TextWidget
              text={
                currentCondition.label
              }
              style={{
                marginTop: 1,

                fontSize: 10,

                fontWeight:
                  '600',

                color:
                  secondaryTextColor,
              }}
            />
          )}
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

function shortenCityName(
  name: string
) {
  const maxLength =
    12;

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

function getShortMessage(
  message?: string
) {
  if (!message) {
    return 'Open JustWeather';
  }

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
    message
      .toLowerCase()
      .includes(
        'location'
      )
  ) {
    return 'Location unavailable';
  }

  return 'Weather unavailable';
}