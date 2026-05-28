export type DailyWeatherDto = {
  date: string; // ISO String
  temperatureCelsius: number;
  condition: string;
  iconURL?: string;
  humidityPercentage: number;
};

export type WeatherForecastDto = {
  destinationID: number;
  destinationName: string;
  openWeatherMapCityID?: string;
  forecasts: DailyWeatherDto[];
};
