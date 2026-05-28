import axiosInstance from "./axiosInstance";
import type { WeatherForecastDto } from "@/types/weather";

export async function getWeatherForecast(destinationId: number, days: number = 7) {
  const response = await axiosInstance.get<WeatherForecastDto>(`/Weather/${destinationId}`, {
    params: { days }
  });
  return response.data;
}
