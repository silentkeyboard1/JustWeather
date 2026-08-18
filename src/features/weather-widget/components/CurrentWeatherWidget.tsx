'use no memo';

import {
  FlexWidget,
  TextWidget,
} from 'react-native-android-widget';

export function CurrentWeatherWidget() {
  return (
    <FlexWidget
      style={{
        width: 'match_parent',
        height: 'match_parent',

        padding: 16,

        borderRadius: 22,

        backgroundGradient: {
          from: '#ABD9F0',
          to: '#F4F5F7',
          orientation: 'TL_BR',
        },

        flexDirection: 'column',

        justifyContent:
          'space-between',
      }}
      accessibilityLabel="JustWeather current weather widget"
    >
      {/* HEADER */}

      <FlexWidget
        style={{
          width: 'match_parent',

          flexDirection: 'row',

          alignItems: 'center',

          justifyContent:
            'space-between',
        }}
      >
        <TextWidget
          text="JustWeather"
          style={{
            fontSize: 16,

            fontWeight: '700',

            color: '#302F2C',
          }}
        />

        <TextWidget
          text="↻"
          clickAction="REFRESH_WEATHER"
          accessibilityLabel="Refresh weather"
          style={{
            fontSize: 24,

            fontWeight: '700',

            color: '#302F2C',

            padding: 4,
          }}
        />
      </FlexWidget>

      {/* CURRENT WEATHER */}

      <FlexWidget
        style={{
          width: 'match_parent',

          flexDirection: 'row',

          alignItems: 'flex-end',

          justifyContent:
            'space-between',
        }}
      >
        <TextWidget
          text="22°"
          style={{
            fontSize: 42,

            fontWeight: '800',

            color: '#302F2C',
          }}
        />

        <TextWidget
          text="Partly cloudy"
          style={{
            fontSize: 14,

            fontWeight: '600',

            color: '#302F2C',

            marginBottom: 6,
          }}
        />
      </FlexWidget>

      {/* HOURLY */}

      <FlexWidget
        style={{
          width: 'match_parent',

          flexDirection: 'row',

          justifyContent:
            'space-between',
        }}
      >
        <Hour
          time="9 pm"
          temperature="20°"
        />

        <Hour
          time="10 pm"
          temperature="19°"
        />

        <Hour
          time="11 pm"
          temperature="18°"
        />

        <Hour
          time="12 am"
          temperature="17°"
        />
      </FlexWidget>
    </FlexWidget>
  );
}

type HourProps = {
  time: string;
  temperature: string;
};

function Hour({
  time,
  temperature,
}: HourProps) {
  return (
    <FlexWidget
      style={{
        alignItems: 'center',
      }}
    >
      <TextWidget
        text={time}
        style={{
          fontSize: 11,

          fontWeight: '600',

          color: '#302F2C',
        }}
      />

      <TextWidget
        text={temperature}
        style={{
          marginTop: 2,

          fontSize: 14,

          fontWeight: '700',

          color: '#302F2C',
        }}
      />
    </FlexWidget>
  );
}