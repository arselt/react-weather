import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addRecentCity,
  formatCityTime,
  formatDaylight,
  getAirQualityLabel,
  getHourlyForecast,
  getWindDirection,
  groupForecastByDay,
  toAirQuality,
  toggleFavoriteCity,
} from './weather.ts';
import type { ForecastItem, ForecastResponse } from '../types/weather.ts';

const CITY_OFFSET_SECONDS = -21600; // UTC-6, like Torreón
const CITY_COORD = { lat: 25.55, lon: -103.43 };

// Builds a slot whose city-local time is the given hour on 2026-11-12/13
const slotAt = (day: number, hour: number, minTemp: number, maxTemp: number, icon: string): ForecastItem => {
  const localAsUtc = Date.UTC(2026, 10, day, hour) / 1000;
  return {
    dt: localAsUtc - CITY_OFFSET_SECONDS,
    main: { temp: (minTemp + maxTemp) / 2, temp_min: minTemp, temp_max: maxTemp },
    weather: [{ id: 800, main: 'Clear', description: `desc ${icon}`, icon }],
    pop: 0.25,
  };
};

const forecastOf = (list: ForecastItem[]): ForecastResponse => ({
  city: { coord: CITY_COORD, timezone: CITY_OFFSET_SECONDS },
  list,
});

test('getWindDirection maps degrees to the nearest compass point', () => {
  assert.equal(getWindDirection(0), 'N');
  assert.equal(getWindDirection(90), 'E');
  assert.equal(getWindDirection(225), 'SW');
  assert.equal(getWindDirection(359), 'N');
  assert.equal(getWindDirection(-45), 'NW');
  assert.equal(getWindDirection(undefined), undefined);
});

test('formatCityTime shows the city clock, not the viewer clock', () => {
  // 12:00 UTC is 06:00 in a UTC-6 city
  const unixNoonUtc = Date.UTC(2026, 10, 12, 12) / 1000;
  assert.match(formatCityTime(unixNoonUtc, CITY_OFFSET_SECONDS), /06:00/);
});

test('formatDaylight renders hours and zero-padded minutes', () => {
  assert.equal(formatDaylight(0, 10 * 3600 + 52 * 60), '10h 52m');
  assert.equal(formatDaylight(0, 9 * 3600 + 5 * 60), '9h 05m');
});

test('getAirQualityLabel maps the 1..5 index and tolerates unknown values', () => {
  assert.equal(getAirQualityLabel(1), 'Good');
  assert.equal(getAirQualityLabel(5), 'Very poor');
  assert.equal(getAirQualityLabel(9), 'Unknown');
});

test('toAirQuality reads the first reading and returns null when empty', () => {
  const response = {
    list: [{ main: { aqi: 2 }, components: { pm2_5: 7.5, pm10: 12, no2: 3, o3: 60 } }],
  };
  assert.deepEqual(toAirQuality(response), { aqi: 2, pm25: 7.5, pm10: 12, no2: 3, o3: 60 });
  assert.equal(toAirQuality({ list: [] }), null);
});

test('getHourlyForecast keeps the next eight slots with rounded rain chance', () => {
  const list = Array.from({ length: 10 }, (_, index) => slotAt(12, index * 3, 1, 2, `i${index}`));
  const hours = getHourlyForecast(forecastOf(list));
  assert.equal(hours.length, 8);
  assert.equal(hours[0].icon, 'i0');
  assert.equal(hours[0].precipitationChance, 25);
});

test('groupForecastByDay takes min/max per local day and the midday icon', () => {
  const days = groupForecastByDay(forecastOf([
    slotAt(12, 0, 10, 12, 'night'),
    slotAt(12, 12, 14, 22, 'day-noon'),
    slotAt(12, 18, 12, 16, 'evening'),
    slotAt(13, 9, 8, 13, 'morning'),
    slotAt(13, 12, 9, 19, 'day2-noon'),
  ]));

  assert.equal(days.length, 2);
  assert.deepEqual(days[0], {
    dateKey: '2026-11-12',
    minTemp: 10,
    maxTemp: 22,
    icon: 'day-noon',
    description: 'desc day-noon',
  });
  assert.equal(days[1].dateKey, '2026-11-13');
  assert.equal(days[1].icon, 'day2-noon');
});

test('groupForecastByDay returns at most five days', () => {
  const list = [10, 11, 12, 13, 14, 15].map((day) => slotAt(day, 12, 1, 2, 'x'));
  assert.equal(groupForecastByDay(forecastOf(list)).length, 5);
});

test('addRecentCity puts the newest first, drops duplicates and caps the list', () => {
  assert.deepEqual(addRecentCity(['Madrid', 'Paris'], 'paris', 5), ['paris', 'Madrid']);
  assert.deepEqual(addRecentCity(['a', 'b', 'c'], 'd', 3), ['d', 'a', 'b']);
});

test('toggleFavoriteCity adds and removes a city case-insensitively', () => {
  assert.deepEqual(toggleFavoriteCity(['Madrid'], 'Lisbon'), ['Madrid', 'Lisbon']);
  assert.deepEqual(toggleFavoriteCity(['Madrid', 'Lisbon'], 'madrid'), ['Lisbon']);
});
