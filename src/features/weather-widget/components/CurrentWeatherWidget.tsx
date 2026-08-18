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

  const backgroundColor: ColorProp =
    isDark
      ? '#111820'
      : '#F4F5F7';

  const textColor: ColorProp =
    isDark
      ? '#E6EDF2'
      : '#302F2C';

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

  /*
   * getWeatherCondition currently defines
   * its color as a normal string.
   *
   * The actual values are valid hex colors,
   * so we tell TypeScript that this value
   * satisfies the widget library's
   * stricter ColorProp type.
   */
  const weatherColor: ColorProp =
    currentCondition
      ? currentCondition.color as ColorProp
      : backgroundColor;

  /*
   * Skip index 0 because that represents
   * the current hour.
   *
   * We want the NEXT four hours.
   */
  const nextHours =
    weather?.hourly.slice(
      1,
      5
    ) ?? [];

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      accessibilityLabel="Open JustWeather"
      style={{
        width: 'match_parent',

        height: 'match_parent',

        padding: 14,

        borderRadius: 22,

        backgroundGradient: {
          from:
            weatherColor,

          to:
            backgroundColor,

          orientation:
            'TL_BR',
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
            width: 22,

            height: 22,

            padding: 4,
          }}
        />
      </FlexWidget>

      {/* NO WEATHER / ERROR */}

      {!weather && (
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
      )}

      {weather && (
        <>
          {/* CURRENT WEATHER */}

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
                fontSize: 40,

                fontWeight:
                  '800',

                color:
                  textColor,
              }}
            />

            {currentCondition && (
              <SvgWidget
                svg={
                  getWidgetWeatherIconSvg(
                    currentCondition.icon,
                    textColor
                  )
                }
                style={{
                  width: 38,

                  height: 38,
                }}
              />
            )}
          </FlexWidget>

          {/* NEXT HOURS */}

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
                    color={
                      textColor
                    }
                  />
                );
              }
            )}
          </FlexWidget>
        </>
      )}
    </FlexWidget>
  );
}

type HourForecastProps = {
  time: string;

  temperature: number;

  icon:
    ReturnType<
      typeof getWeatherCondition
    >['icon'];

  /*
   * Important:
   * not `string`, but ColorProp.
   */
  color: ColorProp;
};

function HourForecast({
  time,
  temperature,
  icon,
  color,
}: HourForecastProps) {
  return (
    <FlexWidget
      style={{
        width: 48,

        alignItems:
          'center',
      }}
    >
      <TextWidget
        text={time}
        style={{
          fontSize: 10,

          fontWeight:
            '600',

          color,
        }}
      />

      <SvgWidget
        svg={
          getWidgetWeatherIconSvg(
            icon,
            color
          )
        }
        style={{
          width: 20,

          height: 20,

          marginTop: 3,

          marginBottom: 2,
        }}
      />

      <TextWidget
        text={`${temperature}°`}
        style={{
          fontSize: 13,

          fontWeight:
            '700',

          color,
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