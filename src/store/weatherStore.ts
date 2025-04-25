import { create } from 'zustand';
import { weatherService, CurrentWeather } from '../services/api/weatherService';
import { analyticsService } from '../services/analyticsService';
import { useUnitsStore } from './unitsStore';

interface WeatherStore {
  currentWeather: CurrentWeather | null;
  loading: boolean;
  error: string | null;
  currentCity: string | null;
  currentCoords: { lat: number; lon: number } | null;
  fetchWeatherByCity: (city: string) => Promise<void>;
  fetchWeatherByCoords: (lat: number, lon: number) => Promise<void>;
  refreshCurrentWeather: () => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  loading: false,
  error: null,
  currentCity: null,
  currentCoords: null,

  fetchWeatherByCity: async (city: string) => {
    set({ loading: true, error: null, currentCity: city, currentCoords: null });
    try {
      // Track city search
      analyticsService.trackSearch(city, 'city');
      
      const weatherData = await weatherService.getCurrentWeatherByCity(city);
      set({ currentWeather: weatherData, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data', 
        loading: false 
      });
    }
  },

  fetchWeatherByCoords: async (lat: number, lon: number) => {
    set({ loading: true, error: null, currentCity: null, currentCoords: { lat, lon } });
    try {
      // Track coordinates search
      analyticsService.trackSearch(`${lat},${lon}`, 'coordinates');
      
      const weatherData = await weatherService.getCurrentWeatherByCoords(lat, lon);
      set({ currentWeather: weatherData, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch weather data', 
        loading: false 
      });
    }
  },

  refreshCurrentWeather: async () => {
    const { currentCity, currentCoords } = get();
    
    if (currentCity) {
      await get().fetchWeatherByCity(currentCity);
    } else if (currentCoords) {
      await get().fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
    }
  }
}));

// Set up a listener to refresh weather data when units change
// This is outside the store to avoid circular dependencies
useUnitsStore.subscribe(
  // Only trigger when the unit changes
  (state, prevState) => {
    if (state.unit !== prevState.unit) {
      // Get the current weather store state and refresh data
      const weatherStore = useWeatherStore.getState();
      weatherStore.refreshCurrentWeather();
    }
  }
); 