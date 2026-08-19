export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;

  weatherCode: number;
  isDay: boolean;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  precipitationProbability: number;

  weatherCode: number;
  isDay: boolean;
};

export type DailyWeather = {
  date: string;

  temperatureMax: number;
  temperatureMin: number;

  precipitationProbability: number;

  weatherCode: number;
};

export type Weather = {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};