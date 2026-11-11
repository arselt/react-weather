import axios from 'axios';
import { getApiClient } from './axios';
import type { MessageKey } from '../../i18n/messages';
import type { Language } from '../../i18n/translate';
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
  getCurrentWeather: (query: WeatherQuery, language: Language) =>
    fetchOpenWeather<CurrentWeather>('/weather', { ...toSearchParams(query), lang: language }),

  getForecast: (query: WeatherQuery, language: Language) =>
    fetchOpenWeather<ForecastResponse>('/forecast', { ...toSearchParams(query), lang: language }),

  getAirPollution: ({ lat, lon }: Coordinates) =>
    fetchOpenWeather<AirPollutionResponse>('/air_pollution', { lat, lon }),
};

export const getWeatherErrorKey = (error: unknown): MessageKey => {
  if (!axios.isAxiosError(error)) return 'error.generic';
  if (!error.response) return 'error.network';
  if (error.response.status === 404) return 'error.cityNotFound';
  if (error.response.status === 401) return 'error.apiKey';
  return 'error.generic';
};
