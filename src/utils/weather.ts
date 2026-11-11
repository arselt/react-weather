import type {
  AirPollutionResponse,
  AirQuality,
  DailyForecast,
  ForecastItem,
  ForecastResponse,
  HourlyForecast,
} from '../types/weather';

const FORECAST_DAYS = 5;
const HOURLY_SLOTS = 8; // 3-hour slots: 24 hours ahead
const MIDDAY_HOUR = 12;
const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const AQI_LABELS = ['Good', 'Fair', 'Moderate', 'Poor', 'Very poor'];

// Shifts a unix timestamp into the city's local clock; read it back through UTC getters
const toCityDate = (unixSeconds: number, timezoneOffset: number) =>
  new Date((unixSeconds + timezoneOffset) * 1000);

const hoursFromMidday = (slot: ForecastItem, timezoneOffset: number) =>
  Math.abs(toCityDate(slot.dt, timezoneOffset).getUTCHours() - MIDDAY_HOUR);

export const getWeatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export const formatCityTime = (unixSeconds: number, timezoneOffset: number) =>
  toCityDate(unixSeconds, timezoneOffset).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

export const formatHourLabel = (unixSeconds: number, timezoneOffset: number) =>
  toCityDate(unixSeconds, timezoneOffset).toLocaleTimeString([], {
    hour: 'numeric',
    timeZone: 'UTC',
  });

export const formatDayLabel = (dateKey: string) =>
  new Date(`${dateKey}T12:00:00Z`).toLocaleDateString([], { weekday: 'short', timeZone: 'UTC' });

// Length of the day between sunrise and sunset, e.g. "10h 52m"
export const formatDaylight = (sunrise: number, sunset: number) => {
  const totalMinutes = Math.round((sunset - sunrise) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${String(minutes).padStart(2, '0')}m`;
};

// OpenWeather omits `deg` when there is no measurable wind
export const getWindDirection = (degrees: number | undefined) => {
  if (degrees === undefined || !Number.isFinite(degrees)) return undefined;
  const normalized = ((degrees % 360) + 360) % 360;
  return COMPASS_POINTS[Math.round(normalized / 45) % COMPASS_POINTS.length];
};

export const getAirQualityLabel = (aqi: number) => AQI_LABELS[aqi - 1] ?? 'Unknown';

export const toAirQuality = (response: AirPollutionResponse): AirQuality | null => {
  const reading = response.list[0];
  if (!reading) return null;
  return {
    aqi: reading.main.aqi,
    pm25: reading.components.pm2_5,
    pm10: reading.components.pm10,
    no2: reading.components.no2,
    o3: reading.components.o3,
  };
};

export const getHourlyForecast = (forecast: ForecastResponse): HourlyForecast[] =>
  forecast.list.slice(0, HOURLY_SLOTS).map((slot) => ({
    dt: slot.dt,
    temp: slot.main.temp,
    icon: slot.weather[0].icon,
    description: slot.weather[0].description,
    precipitationChance: Math.round(slot.pop * 100),
  }));

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

// Adds the city when it is not saved yet, removes it when it is
export const toggleFavoriteCity = (cities: string[], city: string) =>
  cities.some((item) => item.toLowerCase() === city.toLowerCase())
    ? cities.filter((item) => item.toLowerCase() !== city.toLowerCase())
    : [...cities, city];
