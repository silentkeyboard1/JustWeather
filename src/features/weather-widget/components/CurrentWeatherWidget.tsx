'use no memo';

import {
  FlexWidget,
  SvgWidget,
  TextWidget,
} from 'react-native-android-widget';

import type {
  ColorProp,
} from 'react-native-android-widget';

import type { City } from '../../city-search/model/city';

import type { Weather } from '../../weather/model/weather';

import {
  getWeatherCondition,
} from '../../weather/utils/getWeatherCondition';

import type {
  WeatherIconName,
} from '../../weather/utils/getWeatherCondition';

import {
  getRefreshIconSvg,
  getWidgetWeatherIconSvg,
} from '../utils/getWidgetWeatherIconSvg';

type WidgetTheme =
  | 'light'
  | 'dark';

type CurrentWeatherWidgetProps = {
  theme: WidgetTheme;

  city: City | null;

  weather: Weather | null;

  message?: string;
};

export function CurrentWeatherWidget({
  theme,
  city,
  weather,
  message,
}: CurrentWeatherWidgetProps) {
  const isDark =
    theme === 'dark';

  /*
   * Fully opaque base colors.
   *
   * There is no rgba / alpha transparency
   * used for the widget background.
   */
  const backgroundColor: ColorProp =
    isDark
      ? '#111820'
      : '#F4F5F7';

  const textColor: ColorProp =
    isDark
      ? '#E6EDF2'
      : '#302F2C';

  const secondaryTextColor: ColorProp =
    isDark
      ? '#A6B2BB'
      : '#5F6264';

  const dividerColor: ColorProp =
    isDark
      ? '#34414C'
      : '#D5DCE1';

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  const weatherColor: ColorProp =
    currentCondition
      ? currentCondition.color as ColorProp
      : backgroundColor;

  /*
   * Index 0 = current hour.
   *
   * 1 -> 6 gives us the NEXT FIVE hours.
   */
  const nextHours =
    weather?.hourly.slice(
      1,
      6
    ) ?? [];

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel="Open JustWeather"
      style={{
        width:
          'match_parent',

        height:
          'match_parent',

        padding: 16,

        borderRadius: 22,

        /*
         * Solid fallback background.
         *
         * This makes sure the widget
         * itself is never transparent.
         */
        backgroundColor,

        /*
         * Fully opaque weather gradient.
         *
         * Weather color:
         * top-right
         *
         * App background:
         * bottom-left
         */
        backgroundGradient: {
          from:
            weatherColor,

          to:
            backgroundColor,

          orientation:
            'TR_BL',
        },

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
            city?.name ??
            'JustWeather'
          }
          style={{
            fontSize: 16,

            fontWeight:
              '700',

            color:
              textColor,
          }}
        />

        <SvgWidget
          svg={
            getRefreshIconSvg(
              textColor
            )
          }
          clickAction="REFRESH_WEATHER"
          accessibilityLabel="Refresh weather"
          style={{
            width: 24,

            height: 24,

            padding: 4,
          }}
        />
      </FlexWidget>

      {/* CONTENT */}

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

            padding: 12,
          }}
        >
          <TextWidget
            text={
              message ??
              'Open JustWeather once to set your location.'
            }
            style={{
              fontSize: 13,

              fontWeight:
                '600',

              color:
                textColor,

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

            justifyContent:
              'space-between',
          }}
        >
          {/* CURRENT WEATHER */}

          <FlexWidget
            style={{
              width:
                'match_parent',

              flexDirection:
                'row',

              alignItems:
                'flex-end',

              justifyContent:
                'space-between',

              marginTop: 8,

              marginBottom: 10,
            }}
          >
            {/* CURRENT TEMPERATURE */}

            <TextWidget
              text={`${Math.round(
                weather.current
                  .temperature
              )}°`}
              style={{
                fontSize: 42,

                fontWeight:
                  '800',

                color:
                  textColor,
              }}
            />

            {/* CURRENT CONDITION */}

            {currentCondition ? (
              <FlexWidget
                style={{
                  flexDirection:
                    'row',

                  alignItems:
                    'center',

                  marginBottom: 5,
                }}
              >
                <SvgWidget
                  svg={
                    getWidgetWeatherIconSvg(
                      currentCondition.icon,
                      textColor
                    )
                  }
                  style={{
                    width: 30,

                    height: 30,
                  }}
                />

                <TextWidget
                  text={
                    currentCondition.label
                  }
                  style={{
                    marginLeft: 6,

                    fontSize: 11,

                    fontWeight:
                      '600',

                    color:
                      textColor,
                  }}
                />
              </FlexWidget>
            ) : (
              <FlexWidget />
            )}
          </FlexWidget>

          {/* DIVIDER */}

          <FlexWidget
            style={{
              width:
                'match_parent',

              height: 1,

              backgroundColor:
                dividerColor,

              marginBottom: 10,
            }}
          />

          {/* NEXT 5 HOURS */}

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
            {nextHours.map(
              (hour) => {
                const condition =
                  getWeatherCondition(
                    hour.weatherCode,
                    hour.isDay
                  );

                return (
                  <HourForecast
                    key={
                      hour.time
                    }
                    time={
                      formatHour(
                        hour.time
                      )
                    }
                    temperature={
                      Math.round(
                        hour.temperature
                      )
                    }
                    icon={
                      condition.icon
                    }
                    textColor={
                      textColor
                    }
                    secondaryTextColor={
                      secondaryTextColor
                    }
                  />
                );
              }
            )}
          </FlexWidget>
        </FlexWidget>
      )}
    </FlexWidget>
  );
}

type HourForecastProps = {
  time: string;

  temperature: number;

  icon: WeatherIconName;

  textColor: ColorProp;

  secondaryTextColor: ColorProp;
};

function HourForecast({
  time,
  temperature,
  icon,
  textColor,
  secondaryTextColor,
}: HourForecastProps) {
  return (
    <FlexWidget
      style={{
        /*
         * Slightly narrower than before
         * because we now display 5 hours.
         */
        width: 40,

        alignItems:
          'center',
      }}
    >
      {/* TIME */}

      <TextWidget
        text={time}
        style={{
          fontSize: 9,

          fontWeight:
            '600',

          color:
            secondaryTextColor,
        }}
      />

      {/* WEATHER ICON */}

      <SvgWidget
        svg={
          getWidgetWeatherIconSvg(
            icon,
            textColor
          )
        }
        style={{
          width: 19,

          height: 19,

          marginTop: 4,

          marginBottom: 3,
        }}
      />

      {/* TEMPERATURE */}

      <TextWidget
        text={`${temperature}°`}
        style={{
          fontSize: 13,

          fontWeight:
            '700',

          color:
            textColor,
        }}
      />
    </FlexWidget>
  );
}

function formatHour(
  time: string
) {
  const hour =
    Number(
      time.slice(
        11,
        13
      )
    );

  const suffix =
    hour >= 12
      ? 'pm'
      : 'am';

  const displayHour =
    hour % 12 || 12;

  return `${displayHour}${suffix}`;
}