export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  coord: { lon: number; lat: number };
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
    deg?: number; // omitted by OpenWeather when there is no measurable wind
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
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: CurrentWeather['weather'];
  pop: number; // probability of precipitation, 0..1
}

export interface ForecastResponse {
  list: ForecastItem[];
  city: {
    coord: Coordinates;
    timezone: number;
  };
}

export interface HourlyForecast {
  dt: number;
  temp: number;
  icon: string;
  description: string;
  precipitationChance: number; // 0..100
}

export interface DailyForecast {
  dateKey: string; // YYYY-MM-DD in the city's local time
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export interface AirPollutionResponse {
  list: Array<{
    main: { aqi: number }; // 1 = Good ... 5 = Very Poor
    components: Record<string, number>;
  }>;
}

export interface AirQuality {
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
}

export type WeatherQuery =
  | { type: 'city'; city: string }
  | { type: 'coords'; lat: number; lon: number };
