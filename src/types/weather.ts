export interface CurrentWeather {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
  timezone: number; // UTC offset of the city in seconds
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

export interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: CurrentWeather['weather'];
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    timezone: number;
  };
}

export interface DailyForecast {
  dateKey: string; // YYYY-MM-DD in the city's local time
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export type WeatherQuery =
  | { type: 'city'; city: string }
  | { type: 'coords'; lat: number; lon: number };
