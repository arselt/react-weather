import React, { useEffect } from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { useUnitsStore } from '../../store/unitsStore';
import WeatherSkeleton from './WeatherSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import WeatherInfoCard from './WeatherInfoCard';

interface CurrentWeatherProps {
  city?: string;
  lat?: number;
  lon?: number;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city, lat, lon }) => {
  const { currentWeather, loading, error, fetchWeatherByCity, fetchWeatherByCoords } = useWeatherStore();
  const { unitSymbol } = useUnitsStore();

  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city);
    } else if (lat !== undefined && lon !== undefined) {
      fetchWeatherByCoords(lat, lon);
    }
  }, [city, lat, lon, fetchWeatherByCity, fetchWeatherByCoords]);

  if (loading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentWeather) {
    return null;
  }

  const { main, weather, name, sys } = currentWeather;
  const { temp, humidity, feels_like } = main;
  const { description, icon } = weather[0];
  const { country } = sys;

  return (
    <div className="bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary p-6 w-full shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.5)]">
      <div className="flex flex-col">
        <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2">
          {name}, {country}
        </h2>

        <div className="border-t-2 border-b-2 border-text-primary dark:border-dark-text-primary py-4 my-4">
          <div className="flex items-center justify-between">
            <img
              src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
              alt={description}
              className="w-24 h-24 bg-accent dark:bg-dark-accent p-1 border-2 border-text-primary dark:border-dark-text-primary"
            />
            <div className="text-right">
              <div className="text-6xl font-extrabold text-text-primary dark:text-dark-text-primary">
                {Math.round(temp)}{unitSymbol}
              </div>
              <div className="text-text-secondary dark:text-dark-text-secondary text-lg font-medium capitalize">
                {description}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <WeatherInfoCard
            label="Feels like"
            value={Math.round(feels_like)}
            unit={unitSymbol}
          />
          <WeatherInfoCard
            label="Humidity"
            value={humidity}
            unit="%"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
