import { create } from 'zustand';
import { weatherService, getWeatherErrorKey } from '../services/api/weatherService';
import { analyticsService } from '../services/analyticsService';
import { useUnitsStore } from './unitsStore';
import { useRecentCitiesStore } from './recentCitiesStore';
import { useLanguageStore } from './languageStore';
import { getHourlyForecast, groupForecastByDay, toAirQuality } from '../utils/weather';
import type { MessageKey } from '../i18n/messages';
import type { Language } from '../i18n/translate';
import type {
  AirQuality,
  CurrentWeather,
  DailyForecast,
  ForecastResponse,
  HourlyForecast,
  WeatherQuery,
} from '../types/weather';

interface WeatherStore {
  currentWeather: CurrentWeather | null;
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  airQuality: AirQuality | null;
  loading: boolean;
  error: MessageKey | null; // translation key, so the message follows the language
  query: WeatherQuery | null;
  updatedAt: number | null; // epoch ms of the last successful update
  loadWeather: (query: WeatherQuery) => Promise<void>;
  refreshCurrentWeather: () => Promise<void>;
  setError: (key: MessageKey) => void;
}

type SetState = (partial: Partial<WeatherStore>) => void;

// Only the most recent request may update the store, so a slow older response cannot win
let latestRequestId = 0;

const fetchWeather = async (query: WeatherQuery, language: Language, set: SetState) => {
  const requestId = ++latestRequestId;
  set({ loading: true, error: null, query });

  let forecastResponse: ForecastResponse;
  try {
    const [currentWeather, forecastResult] = await Promise.all([
      weatherService.getCurrentWeather(query, language),
      weatherService.getForecast(query, language),
    ]);
    forecastResponse = forecastResult;
    if (requestId !== latestRequestId) return;

    set({
      currentWeather,
      forecast: groupForecastByDay(forecastResponse),
      hourly: getHourlyForecast(forecastResponse),
      updatedAt: Date.now(),
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
      error: getWeatherErrorKey(error),
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
  updatedAt: null,

  loadWeather: async (query) => {
    analyticsService.trackSearch(
      query.type === 'city' ? query.city : `${query.lat},${query.lon}`,
      query.type === 'city' ? 'city' : 'coordinates',
    );
    await fetchWeather(query, useLanguageStore.getState().language, set);
  },

  refreshCurrentWeather: async () => {
    const { query } = get();
    if (query) {
      await fetchWeather(query, useLanguageStore.getState().language, set);
    }
  },

  // Used for failures that are not a weather request (e.g. location denied); clears the query so no retry is offered
  setError: (key) => {
    set({ error: key, loading: false, query: null });
  },
}));

// Refetch when the unit or the language changes. Subscribed here, outside create(), to avoid a circular import
useUnitsStore.subscribe((state, prevState) => {
  if (state.unit !== prevState.unit) {
    void useWeatherStore.getState().refreshCurrentWeather();
  }
});

useLanguageStore.subscribe((state, prevState) => {
  if (state.language !== prevState.language) {
    void useWeatherStore.getState().refreshCurrentWeather();
  }
});
