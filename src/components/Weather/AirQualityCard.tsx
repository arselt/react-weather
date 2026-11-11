import React from 'react';
import type { AirQuality } from '../../types/weather';
import { getAirQualityKey } from '../../utils/weather';
import { useTranslation } from '../../i18n/useTranslation';

interface AirQualityCardProps {
  airQuality: AirQuality;
}

const LEVEL_COLOR_CLASSES = [
  'bg-success dark:bg-dark-success',
  'bg-success dark:bg-dark-success',
  'bg-warning dark:bg-dark-warning',
  'bg-danger dark:bg-dark-danger',
  'bg-danger dark:bg-dark-danger',
];
const SEGMENT_COUNT = 5;

const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  const { t } = useTranslation();
  const { aqi, pm25, pm10, no2, o3 } = airQuality;
  const pollutants = [
    { label: 'PM2.5', value: pm25 },
    { label: 'PM10', value: pm10 },
    { label: 'NO₂', value: no2 },
    { label: 'O₃', value: o3 },
  ];

  return (
    <section className="mt-6 p-4 border-2 border-text-primary dark:border-dark-text-primary bg-bg dark:bg-dark-bg" aria-labelledby="air-quality-title">
      <div className="flex items-baseline justify-between gap-2">
        <h3 id="air-quality-title" className="text-xl font-extrabold text-text-primary dark:text-dark-text-primary">
          {t('weather.airQuality')}
        </h3>
        <p className="font-bold text-text-primary dark:text-dark-text-primary">
          {t(getAirQualityKey(aqi))} <span className="text-text-secondary dark:text-dark-text-secondary">{t('weather.aqiValue', { aqi })}</span>
        </p>
      </div>

      {/* One block per level, filled up to the current index */}
      <div className="mt-3 grid grid-cols-5 gap-1" role="img" aria-label={t('weather.aqiBar', { aqi })}>
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <span
            key={index}
            className={`h-3 border-2 border-text-primary dark:border-dark-text-primary ${
              index < aqi ? LEVEL_COLOR_CLASSES[index] : 'bg-surface dark:bg-dark-surface'
            }`}
          />
        ))}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 @md:grid-cols-4">
        {pollutants.map((pollutant) => (
          <div key={pollutant.label}>
            <dt className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{pollutant.label}</dt>
            <dd className="font-bold text-text-primary dark:text-dark-text-primary">
              {pollutant.value.toFixed(1)} <span className="text-sm font-medium">µg/m³</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default AirQualityCard;
