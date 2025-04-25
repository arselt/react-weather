import React, { useEffect } from 'react';
import { useWeatherStore } from '../../store/weatherStore';
import { useUnitsStore } from '../../store/unitsStore';
import WeatherSkeleton from './WeatherSkeleton';
import ErrorMessage from '../ui/ErrorMessage';
import WeatherInfoCard from './WeatherInfoCard';
import MainWeatherCard from './MainWeatherCard';

interface CurrentWeatherProps {
  city?: string;
  lat?: number;
  lon?: number;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ city, lat, lon }) => {
  const { currentWeather, loading, error, fetchWeatherByCity, fetchWeatherByCoords } = useWeatherStore();
  const { unitSymbol, unit } = useUnitsStore();

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

  const { main, weather, name, sys, dt, wind } = currentWeather;
  const { temp, humidity, feels_like } = main;
  const { description, icon } = weather[0];
  const { country } = sys;
  const { speed } = wind;
  
  const windSpeedUnit = unit === "metric" ? "M/s" : " Mph";

  return (
    <div className="bg-surface dark:bg-dark-surface border-2 border-text-primary dark:border-dark-text-primary p-6 w-full shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.5)]">
      <div className="flex flex-col">
        <h2 className="text-3xl font-extrabold text-text-primary dark:text-dark-text-primary mb-2">
          {name}, {country}
        </h2>

        <MainWeatherCard 
          cityName={name}
          country={country}
          temp={temp}
          description={description}
          iconCode={icon}
          unitSymbol={unitSymbol}
          timestamp={dt}
        />

        <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
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
          <WeatherInfoCard
            label="Wind speed"
            value={speed}
            unit={windSpeedUnit}
            className="col-span-2"
          />
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
