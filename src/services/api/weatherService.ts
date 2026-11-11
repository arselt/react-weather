import axios from 'axios';
import { getApiClient } from './axios';
import type {
  AirPollutionResponse,
  Coordinates,
  CurrentWeather,
  ForecastResponse,
  WeatherQuery,
} from '../../types/weather';

// Dev calls OpenWeather directly (`q`); production goes through the Netlify functions (`city`)
const toSearchParams = (query: WeatherQuery): Record<string, string | number> => {
  if (query.type === 'coords') {
    return { lat: query.lat, lon: query.lon };
  }
  return import.meta.env.DEV ? { q: query.city } : { city: query.city };
};

const fetchOpenWeather = async <T>(
  endpoint: '/weather' | '/forecast' | '/air_pollution',
  params: Record<string, string | number>,
): Promise<T> => {
  const response = await getApiClient().get<T>(endpoint, { params });
  return response.data;
};

export const weatherService = {
  getCurrentWeather: (query: WeatherQuery) =>
    fetchOpenWeather<CurrentWeather>('/weather', toSearchParams(query)),

  getForecast: (query: WeatherQuery) =>
    fetchOpenWeather<ForecastResponse>('/forecast', toSearchParams(query)),

  getAirPollution: ({ lat, lon }: Coordinates) =>
    fetchOpenWeather<AirPollutionResponse>('/air_pollution', { lat, lon }),
};

export const getWeatherErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return 'Something went wrong while loading the weather. Try again.';
  }
  if (!error.response) {
    return 'Could not reach the weather service. Check your connection and try again.';
  }
  if (error.response.status === 404) {
    return 'City not found. Check the spelling and try again.';
  }
  if (error.response.status === 401) {
    return 'The weather service is not configured correctly. Check the API key.';
  }
  return 'Something went wrong while loading the weather. Try again.';
};
