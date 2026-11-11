import type { DailyForecast, ForecastItem, ForecastResponse } from '../types/weather';

const FORECAST_DAYS = 5;
const MIDDAY_HOUR = 12;
const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

// Shifts a unix timestamp into the city's local clock; read it back through UTC getters
const toCityDate = (unixSeconds: number, timezoneOffset: number) =>
  new Date((unixSeconds + timezoneOffset) * 1000);

const hoursFromMidday = (slot: ForecastItem, timezoneOffset: number) =>
  Math.abs(toCityDate(slot.dt, timezoneOffset).getUTCHours() - MIDDAY_HOUR);

export const getWeatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const formatCityTime =(unixSeconds: number, timezoneOffset: number) =>
  toCityDate(unixSeconds, timezoneOffset).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

export const formatDayLabel = (dateKey: string) =>
  new Date(`${dateKey}T12:00:00Z`).toLocaleDateString([], { weekday: 'short', timeZone: 'UTC' });

// OpenWeather omits `deg` when there is no measurable wind
export const getWindDirection = (degrees: number | undefined) => {
  if (degrees === undefined || !Number.isFinite(degrees)) return undefined;
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS_POINTS[Math.round(normalized / 45) % COMPASS_POINTS.length];
};

// Groups 3-hour slots by the city's local day: min/max of the day, icon from the slot nearest midday
export const groupForecastByDay = (forecast: ForecastResponse): DailyForecast[] => {
  const { timezone } = forecast.city;
  const slotsByDay = new Map<string, ForecastItem[]>();

  for (const slot of forecast.list) {
    const dateKey = toCityDate(slot.dt, timezone).toISOString().slice(0, 10);
    slotsByDay.set(dateKey, [...(slotsByDay.get(dateKey) ?? []), slot]);
  }

  return [...slotsByDay.entries()]
    .slice(0, FORECAST_DAYS)
    .map(([dateKey, slots]) => {
      const middaySlot = slots.reduce((best, slot) =>
        hoursFromMidday(slot, timezone) < hoursFromMidday(best, timezone) ? slot : best,
      );

      return {
        dateKey,
        minTemp: Math.min(...slots.map((slot) => slot.main.temp_min)),
        maxTemp: Math.max(...slots.map((slot) => slot.main.temp_max)),
        icon: middaySlot.weather[0].icon,
        description: middaySlot.weather[0].description,
      };
    });
};

// Most recent first, no duplicates (case-insensitive), capped at `limit`
export const addRecentCity = (cities: string[], city: string, limit: number) => {
  const others = cities.filter((item) => item.toLowerCase() !== city.toLowerCase());
  return [city, ...others].slice(0, limit);
};
