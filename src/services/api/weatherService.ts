import { getApiClient } from './axios';

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
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
}

// Dev calls OpenWeather directly (`q`), production goes through the Netlify function (`city`)
const fetchCurrentWeather = async (searchParams: Record<string, string | number>): Promise<CurrentWeather> => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get<CurrentWeather>('/weather', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const weatherService = {
  getCurrentWeatherByCity: (city: string): Promise<CurrentWeather> =>
    fetchCurrentWeather(import.meta.env.DEV ? { q: city } : { city }),

  getCurrentWeatherByCoords: (lat: number, lon: number): Promise<CurrentWeather> =>
    fetchCurrentWeather({ lat, lon }),
};
