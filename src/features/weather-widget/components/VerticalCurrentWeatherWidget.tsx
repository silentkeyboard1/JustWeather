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

type VerticalCurrentWeatherWidgetProps = {
  theme: WidgetTheme;

  city: City | null;

  weather: Weather | null;

  message?: string;
};

export function VerticalCurrentWeatherWidget({
  theme,
  city,
  weather,
  message,
}: VerticalCurrentWeatherWidgetProps) {
  const isDark =
    theme === 'dark';

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

  const hourlyBackgroundColor: ColorProp =
    isDark
      ? '#2B2C2F'
      : '#E3E5E8';

  const currentCondition =
    weather
      ? getWeatherCondition(
          weather.current.weatherCode,
          weather.current.isDay
        )
      : null;

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

        padding: 14,

        borderRadius:
          22,

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
            fontSize:
              15,

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
            width: 22,

            height: 22,

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
              8,
          }}
        >
          <TextWidget
            text={
              message ??
              'Open JustWeather once to set your location.'
            }
            style={{
              fontSize:
                11,

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
          }}
        >
          {/* CURRENT WEATHER */}

          <FlexWidget
            style={{
              width:
                'match_parent',

              marginTop:
                8,

              flexDirection:
                'row',

              alignItems:
                'center',

              justifyContent:
                'space-between',
            }}
          >
            {/* TEMPERATURE + CONDITION */}

            <FlexWidget
              style={{
                flexDirection:
                  'column',

                alignItems:
                  'flex-start',
              }}
            >
              <TextWidget
                text={`${Math.round(
                  weather.current
                    .temperature
                )}°`}
                style={{
                  fontSize:
                    38,

                  fontWeight:
                    '800',

                  color:
                    textColor,
                }}
              />

              {currentCondition && (
                <TextWidget
                  text={
                    currentCondition.label
                  }
                  style={{
                    marginTop:
                      1,

                    fontSize:
                      11,

                    fontWeight:
                      '600',

                    color:
                      secondaryTextColor,
                  }}
                />
              )}
            </FlexWidget>

            {/* CURRENT WEATHER ICON */}

            {currentCondition ? (
              <SvgWidget
                svg={
                  getWidgetWeatherIconSvg(
                    currentCondition.icon,
                    textColor
                  )
                }
                style={{
                  width: 42,

                  height: 42,

                  marginRight:
                    2,
                }}
              />
            ) : (
              <FlexWidget />
            )}
          </FlexWidget>

          {/* NEXT 5 HOURS */}

          <FlexWidget
            style={{
              width:
                'match_parent',

              marginTop:
                14,

              paddingHorizontal:
                10,

              paddingVertical:
                9,

              borderRadius:
                18,

              backgroundColor:
                hourlyBackgroundColor,

              flexDirection:
                'column',
            }}
          >
            {nextHours.map(
              (
                hour,
                index
              ) => {
                const condition =
                  getWeatherCondition(
                    hour.weatherCode,
                    hour.isDay
                  );

                return (
                  <VerticalHourForecast
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
                    addSpacing={
                      index > 0
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

type VerticalHourForecastProps = {
  time: string;

  temperature: number;

  icon: WeatherIconName;

  textColor: ColorProp;

  secondaryTextColor: ColorProp;

  addSpacing: boolean;
};

function VerticalHourForecast({
  time,
  temperature,
  icon,
  textColor,
  secondaryTextColor,
  addSpacing,
}: VerticalHourForecastProps) {
  return (
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

        marginTop:
          addSpacing
            ? 6
            : 0,
      }}
    >
      <TextWidget
        text={
          time
        }
        style={{
          width: 34,

          fontSize:
            9,

          fontWeight:
            '600',

          color:
            secondaryTextColor,
        }}
      />

      <SvgWidget
        svg={
          getWidgetWeatherIconSvg(
            icon,
            textColor
          )
        }
        style={{
          width: 18,

          height: 18,
        }}
      />

      <TextWidget
        text={`${temperature}°`}
        style={{
          width: 32,

          fontSize:
            12,

          fontWeight:
            '700',

          color:
            textColor,

          textAlign:
            'right',
        }}
      />
    </FlexWidget>
  );
}

function shortenCityName(
  name: string
) {
  const maxLength =
    14;

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