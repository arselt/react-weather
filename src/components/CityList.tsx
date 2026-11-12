import React from 'react';
import { useTranslation } from '../i18n/useTranslation';

interface CityListProps {
  cities: string[];
  emptyText: string;
  onSelect: (city: string) => void;
  onRemove?: (city: string) => void;
}

const CityList: React.FC<CityListProps> = ({ cities, emptyText, onSelect, onRemove }) => {
  const { t } = useTranslation();

  if (cities.length === 0) {
    return <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{emptyText}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {cities.map((city) => (
        <li key={city} className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => onSelect(city)}
            className="flex-grow min-w-0 truncate px-3 py-2 text-left font-bold bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary
                      border-2 border-text-primary dark:border-dark-text-primary hover:translate-y-[-2px] transition-transform"
          >
            {city}
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(city)}
              aria-label={t('city.remove', { city })}
              className="px-3 font-bold bg-bg dark:bg-dark-bg text-danger dark:text-dark-danger
                        border-2 border-text-primary dark:border-dark-text-primary hover:translate-y-[-2px] transition-transform"
            >
              ×
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default CityList;
