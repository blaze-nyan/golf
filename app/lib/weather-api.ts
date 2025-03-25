// app/lib/weather-api.ts
import axios from "axios";
import { logger } from "@/app/lib/logger";
// app/lib/weather-api.ts
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "windy";
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  visibility: number;
  uvIndex: number;
}

// Commenting out hourly forecast interface for later
/*
export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: WeatherData['condition'];
  precipitation: number;
  windSpeed: number;
}
*/

const degreesToDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
};

const mapCondition = (weatherId: number): WeatherData["condition"] => {
  if (weatherId >= 200 && weatherId < 300) return "stormy";
  if (weatherId >= 300 && weatherId < 600) return "rainy";
  if (weatherId >= 600 && weatherId < 700) return "rainy";
  if (weatherId >= 801 && weatherId < 900) return "cloudy";
  return "sunny";
};

export const getWeather = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    return {
      temperature: Math.round(response.data.main.temp),
      condition: mapCondition(response.data.weather[0].id),
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed * 3.6),
      windDirection: degreesToDirection(response.data.wind.deg),
      precipitation: response.data.rain ? response.data.rain["1h"] || 0 : 0,
      visibility: response.data.visibility / 1000,
      uvIndex: response.data.uvi || 0, // Note: UV index might not be available in free plan
    };
  } catch (error) {
    logger.error("Error fetching weather:", error);
    throw error;
  }
};
