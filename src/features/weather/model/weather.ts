export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  precipitationProbability: number;
};

export type DailyWeather = {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
};

export type Weather = {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
};