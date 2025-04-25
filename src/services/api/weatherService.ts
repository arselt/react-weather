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

export const weatherService = {
  /**
   * Get current weather data by city name
   */
  getCurrentWeatherByCity: async (city: string): Promise<CurrentWeather> => {
    try {
      const apiClient = getApiClient();
      const isLocalDev = import.meta.env.DEV;
      
      // In production use the Netlify function, in development call OpenWeather directly
      const endpoint = isLocalDev ? '/weather' : '/weather';
      const params = isLocalDev ? { q: city } : { city };
      
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  },

  /**
   * Get current weather data by coordinates
   */
  getCurrentWeatherByCoords: async (lat: number, lon: number): Promise<CurrentWeather> => {
    try {
      const apiClient = getApiClient();
      const isLocalDev = import.meta.env.DEV;
      
      // In production use the Netlify function, in development call OpenWeather directly
      const endpoint = isLocalDev ? '/weather' : '/weather';
      // Parameter names stay the same for both
      
      const response = await apiClient.get(endpoint, {
        params: { lat, lon }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }
}; 