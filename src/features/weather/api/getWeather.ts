import type { City } from '../../city-search/model/city';
import type { Weather } from '../model/weather';

type OpenMeteoWeatherResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
};

export async function getWeather(
  city: City
): Promise<Weather> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_hours=12&forecast_days=7&timezone=auto`
  );

  if (!response.ok) {
    throw new Error(
      'Fehler beim Laden des Wetters'
    );
  }

  const data =
    (await response.json()) as OpenMeteoWeatherResponse;

  return {
    current: {
      temperature:
        data.current.temperature_2m,

      apparentTemperature:
        data.current.apparent_temperature,

      humidity:
        data.current.relative_humidity_2m,

      windSpeed:
        data.current.wind_speed_10m,
    },

    hourly: data.hourly.time.map(
      (time, index) => ({
        time,

        temperature:
          data.hourly.temperature_2m[index],

        precipitationProbability:
          data.hourly
            .precipitation_probability[index],
      })
    ),

    daily: data.daily.time.map(
      (date, index) => ({
        date,

        temperatureMax:
          data.daily.temperature_2m_max[index],

        temperatureMin:
          data.daily.temperature_2m_min[index],

        precipitationProbability:
          data.daily
            .precipitation_probability_max[index],
      })
    ),
  };
}