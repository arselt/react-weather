import { create } from 'zustand';
import { weatherService, getWeatherErrorMessage } from '../services/api/weatherService';
import { analyticsService } from '../services/analyticsService';
import { useUnitsStore } from './unitsStore';
import { useRecentCitiesStore } from './recentCitiesStore';
import { groupForecastByDay } from '../utils/weather';
import type { CurrentWeather, DailyForecast, WeatherQuery } from '../types/weather';

interface WeatherStore {
  currentWeather: CurrentWeather | null;
  forecast: DailyForecast[];
  loading: boolean;
  error: string | null;
  query: WeatherQuery | null;
  loadWeather: (query: WeatherQuery) => Promise<void>;
  refreshCurrentWeather: () => Promise<void>;
  setError: (message: string) => void;
}

// Only the most recent request may update the store, so a slow older response cannot win
let latestRequestId = 0;

const fetchWeather = async (query: WeatherQuery, set: (partial: Partial<WeatherStore>) => void) => {
  const requestId = ++latestRequestId;
  set({ loading: true, error: null, query });

  try {
    const [currentWeather, forecastResponse] = await Promise.all([
      weatherService.getCurrentWeather(query),
      weatherService.getForecast(query),
    ]);
    if (requestId !== latestRequestId) return;

    set({
      currentWeather,
      forecast: groupForecastByDay(forecastResponse),
      loading: false,
    });
    useRecentCitiesStore.getState().addCity(currentWeather.name);
  } catch (error) {
    if (requestId !== latestRequestId) return;

    set({
      currentWeather: null,
      forecast: [],
      error: getWeatherErrorMessage(error),
      loading: false,
    });
  }
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: [],
  loading: false,
  error: null,
  query: null,

  loadWeather: async (query) => {
    analyticsService.trackSearch(
      query.type === 'city' ? query.city : `${query.lat},${query.lon}`,
      query.type === 'city' ? 'city' : 'coordinates',
    );
    await fetchWeather(query, set);
  },

  refreshCurrentWeather: async () => {
    const { query } = get();
    if (query) {
      await fetchWeather(query, set);
    }
  },

  // Used for failures that are not a weather request (e.g. location denied); clears the query so no retry is offered
  setError: (message) => {
    set({ error: message, loading: false, query: null });
  },
}));

// Refetch when the unit changes. Subscribed here, outside create(), to avoid a circular import
useUnitsStore.subscribe((state, prevState) => {
  if (state.unit !== prevState.unit) {
    void useWeatherStore.getState().refreshCurrentWeather();
  }
});
