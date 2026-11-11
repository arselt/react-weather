import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addRecentCity, formatCityTime, getWindDirection, groupForecastByDay } from './weather.ts';
import type { ForecastItem, ForecastResponse } from '../types/weather.ts';

const CITY_OFFSET_SECONDS = -21600; // UTC-6, like Torreón

// Builds a slot whose city-local time is the given hour on 2026-11-12/13
const slotAt = (day: number, hour: number, minTemp: number, maxTemp: number, icon: string): ForecastItem => {
  const localAsUtc = Date.UTC(2026, 10, day, hour) / 1000;
  return {
    dt: localAsUtc - CITY_OFFSET_SECONDS,
    main: { temp_min: minTemp, temp_max: maxTemp },
    weather: [{ id: 800, main: 'Clear', description: `desc ${icon}`, icon }],
  };
};

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

test('groupForecastByDay takes min/max per local day and the midday icon', () => {
  const forecast: ForecastResponse = {
    city: { timezone: CITY_OFFSET_SECONDS },
    list: [
      slotAt(12, 0, 10, 12, 'night'),
      slotAt(12, 12, 14, 22, 'day-noon'),
      slotAt(12, 18, 12, 16, 'evening'),
      slotAt(13, 9, 8, 13, 'morning'),
      slotAt(13, 12, 9, 19, 'day2-noon'),
    ],
  };

  const days = groupForecastByDay(forecast);

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
  assert.equal(groupForecastByDay({ city: { timezone: CITY_OFFSET_SECONDS }, list }).length, 5);
});

test('addRecentCity puts the newest first, drops duplicates and caps the list', () => {
  assert.deepEqual(addRecentCity(['Madrid', 'Paris'], 'paris', 5), ['paris', 'Madrid']);
  assert.deepEqual(addRecentCity(['a', 'b', 'c'], 'd', 3), ['d', 'a', 'b']);
});
