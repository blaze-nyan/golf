// app/components/Weather/WeatherWidget.tsx
"use client";
import React, { useEffect, useState } from "react";

import { Card, CardBody, Tooltip, Spinner } from "@heroui/react";
import { Cloud, Sun, CloudRain, Wind, CloudLightning } from "lucide-react";
import { getWeather } from "@/app/lib/weather-api";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy" | "windy";
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  visibility: number;
  uvIndex: number;
}

// Mock data
// const mockWeather: WeatherData = {
//   temperature: 28,
//   condition: "sunny",
//   humidity: 65,
//   windSpeed: 12,
//   windDirection: "NE",
//   precipitation: 0,
//   visibility: 10, // in km
//   uvIndex: 7,
// };

const WeatherIcon = ({
  condition,
}: {
  condition: WeatherData["condition"];
}) => {
  switch (condition) {
    case "sunny":
      return <Sun className="w-8 h-8 text-yellow-500" />;
    case "cloudy":
      return <Cloud className="w-8 h-8 text-gray-500" />;
    case "rainy":
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    case "stormy":
      return <CloudLightning className="w-8 h-8 text-purple-500" />;
    case "windy":
      return <Wind className="w-8 h-8 text-gray-500" />;
  }
};

export function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getPlayabilityStatus = (currentWeather: WeatherData) => {
    if (currentWeather.condition === "stormy")
      return { status: "Unsafe", color: "text-red-500" };
    if (currentWeather.windSpeed > 35)
      return { status: "Not Recommended", color: "text-red-500" };
    if (currentWeather.precipitation > 5)
      return { status: "Poor", color: "text-orange-500" };
    if (currentWeather.windSpeed > 25)
      return { status: "Challenging", color: "text-yellow-500" };
    return { status: "Good", color: "text-green-500" };
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const data = await getWeather(1.3521, 103.8198);
        setWeather(data);
      } catch (err) {
        setError("Failed to load weather data");
        throw err;
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !weather)
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const playability = getPlayabilityStatus(weather);

  return (
    <Card className="max-w-[400px] min-w-[300px] flex items-center justify-center weather-widget">
      <CardBody>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <WeatherIcon condition={weather.condition} />
            <div>
              <p className="text-2xl font-bold">{weather.temperature}°C</p>
              <p className="text-sm text-gray-500 capitalize">
                {weather.condition}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Playing Conditions</p>
            <p className={`font-medium ${playability.color}`}>
              {playability.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Tooltip content="Strong winds can affect ball trajectory">
            <div>
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-medium">
                {weather.windSpeed} km/h {weather.windDirection}
              </p>
            </div>
          </Tooltip>

          <Tooltip content="High humidity can affect grip and ball distance">
            <div>
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weather.humidity}%</p>
            </div>
          </Tooltip>

          <Tooltip content="Affects course visibility and shot planning">
            <div>
              <p className="text-sm text-gray-500">Visibility</p>
              <p className="font-medium">{weather.visibility} km</p>
            </div>
          </Tooltip>

          {weather.windSpeed > 25 && (
            <div className="mt-4 text-sm text-yellow-600 bg-yellow-50 p-2 rounded">
              ⚠️ High winds may affect ball flight and club selection
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
