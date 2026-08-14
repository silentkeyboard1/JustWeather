import type { City } from '../../city-search/model/city';
import type { CurrentWeather } from '../model/weather';

type OpenMeteoWeatherResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
  };
};

export async function getCurrentWeather(
  city: City
): Promise<CurrentWeather> {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Error(
      'Fehler beim Laden des Wetters'
    );
  }

  const data =
    (await response.json()) as OpenMeteoWeatherResponse;

  return {
    temperature: data.current.temperature_2m,
    apparentTemperature:
      data.current.apparent_temperature,
    humidity:
      data.current.relative_humidity_2m,
    windSpeed:
      data.current.wind_speed_10m,
  };
}