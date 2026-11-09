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

import {
  getWidgetThemeColors,
} from '../utils/widgetTheme';

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
  const {
    backgroundColor,
    textColor,
    secondaryTextColor,
    hourlyBackgroundColor,
  } =
    getWidgetThemeColors(
      theme
    );

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

        /*
         * Keep the horizontal spacing,
         * but reduce vertical padding.
         *
         * This gives us more safety room
         * on launchers that provide a
         * slightly shorter 4x2 widget.
         */
        paddingHorizontal:
          16,

        paddingVertical:
          12,

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
            city?.name ??
            'JustWeather'
          }
          style={{
            fontSize:
              16,

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
            width:
              24,

            height:
              24,

            padding:
              4,
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

            padding:
              12,
          }}
        >
          <TextWidget
            text={
              message ??
              'Open JustWeather once to set your location.'
            }
            style={{
              fontSize:
                13,

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

              /*
               * Reduced from:
               *
               * marginTop: 8
               * marginBottom: 10
               */
              marginTop:
                4,

              marginBottom:
                6,
            }}
          >
            {/* CURRENT TEMPERATURE */}

            <TextWidget
              text={`${Math.round(
                weather.current
                  .temperature
              )}°`}
              style={{
                fontSize:
                  42,

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

                  marginBottom:
                    5,
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
                    width:
                      30,

                    height:
                      30,
                  }}
                />

                <TextWidget
                  text={
                    currentCondition.label
                  }
                  style={{
                    marginLeft:
                      6,

                    fontSize:
                      11,

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

              /*
               * Reduced from 8.
               */
              marginTop:
                4,

              backgroundColor:
                hourlyBackgroundColor,

              borderRadius:
                20,

              paddingHorizontal:
                12,

              /*
               * Reduced from 8.
               */
              paddingVertical:
                6,
            }}
          >
            {nextHours.map(
              hour => {
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
        width:
          40,

        alignItems:
          'center',
      }}
    >
      {/* TIME */}

      <TextWidget
        text={
          time
        }
        style={{
          fontSize:
            9,

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
          width:
            19,

          height:
            19,

          /*
           * Slightly less vertical
           * spacing inside every hour.
           */
          marginTop:
            3,

          marginBottom:
            2,
        }}
      />

      {/* TEMPERATURE */}

      <TextWidget
        text={`${temperature}°`}
        style={{
          fontSize:
            13,

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
    hour % 12 ||
    12;

  return `${displayHour}${suffix}`;
}