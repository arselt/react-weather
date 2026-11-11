import { Handler } from '@netlify/functions';
import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const MAX_CITY_LENGTH = 100;
const MAX_LATITUDE = 90;
const MAX_LONGITUDE = 180;

const isValidCoordinate = (value: string, limit: number) => {
  const number = Number(value);
  return Number.isFinite(number) && Math.abs(number) <= limit;
};

// Shared by every function that proxies OpenWeather, so the API key never reaches the browser
export const createOpenWeatherProxy = (endpoint: 'weather' | 'forecast' | 'air_pollution'): Handler => async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const params = event.queryStringParameters || {};
  const city = params.city?.trim().slice(0, MAX_CITY_LENGTH);
  const { lat, lon } = params;
  const units = params.units === 'imperial' ? 'imperial' : 'metric';
  const language = params.lang === 'es' ? 'es' : 'en'; // weather descriptions only

  const hasCoordinates = Boolean(lat && lon);
  const hasValidCoordinates = hasCoordinates
    && isValidCoordinate(lat!, MAX_LATITUDE)
    && isValidCoordinate(lon!, MAX_LONGITUDE);

  if (!city && !hasValidCoordinates) {
    return { statusCode: 400, body: JSON.stringify({ error: 'City or valid coordinates required' }) };
  }

  const apiParams: Record<string, string> = {
    appid: process.env.OPENWEATHER_API_KEY!,
    units,
  };
  if (endpoint !== 'air_pollution') {
    apiParams.lang = language;
  }

  if (city) {
    apiParams.q = city;
  } else {
    apiParams.lat = lat!;
    apiParams.lon = lon!;
  }

  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/${endpoint}`, { params: apiParams });
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const isNotFound = error.response.status === 404;
      return {
        statusCode: error.response.status,
        body: JSON.stringify({
          error: isNotFound ? 'Location not found' : error.response.statusText,
          details: error.response.data,
        }),
      };
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { statusCode: 500, body: JSON.stringify({ error: errorMessage }) };
  }
};
