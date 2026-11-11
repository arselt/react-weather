import { create } from 'zustand';
import { weatherService, getWeatherErrorMessage } from '../services/api/weatherService';
import { analyticsService } from '../services/analyticsService';
import { useUnitsStore } from './unitsStore';
import { useRecentCitiesStore } from './recentCitiesStore';
import { getHourlyForecast, groupForecastByDay, toAirQuality } from '../utils/weather';
import type {
  AirQuality,
  ForecastResponse,
  CurrentWeather,
  DailyForecast,
  HourlyForecast,
  WeatherQuery,
} from '../types/weather';

interface WeatherStore {
  currentWeather: CurrentWeather | null;
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  airQuality: AirQuality | null;
  loading: boolean;
  error: string | null;
  query: WeatherQuery | null;
  loadWeather: (query: WeatherQuery) => Promise<void>;
  refreshCurrentWeather: () => Promise<void>;
  setError: (message: string) => void;
}

type SetState = (partial: Partial<WeatherStore>) => void;

// Only the most recent request may update the store, so a slow older response cannot win
let latestRequestId = 0;

const fetchWeather = async (query: WeatherQuery, set: SetState) => {
  const requestId = ++latestRequestId;
  set({ loading: true, error: null, query });

  let forecastResponse: ForecastResponse;
  try {
    const [currentWeather, forecastResult] = await Promise.all([
      weatherService.getCurrentWeather(query),
      weatherService.getForecast(query),
    ]);
    forecastResponse = forecastResult;
    if (requestId !== latestRequestId) return;

    set({
      currentWeather,
      forecast: groupForecastByDay(forecastResponse),
      hourly: getHourlyForecast(forecastResponse),
      loading: false,
    });
    useRecentCitiesStore.getState().addCity(currentWeather.name);
  } catch (error) {
    if (requestId !== latestRequestId) return;

    set({
      currentWeather: null,
      forecast: [],
      hourly: [],
      airQuality: null,
      error: getWeatherErrorMessage(error),
      loading: false,
    });
    return;
  }

  // Air quality is secondary: if it fails, the rest of the weather still shows
  try {
    const airResponse = await weatherService.getAirPollution(forecastResponse.city.coord);
    if (requestId === latestRequestId) {
      set({ airQuality: toAirQuality(airResponse) });
    }
  } catch {
    if (requestId === latestRequestId) {
      set({ airQuality: null });
    }
  }
};

export const useWeatherStore = create<WeatherStore>((set, get) => ({
  currentWeather: null,
  forecast: [],
  hourly: [],
  airQuality: null,
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
