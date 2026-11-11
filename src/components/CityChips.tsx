import React from 'react';

interface CityChipsProps {
  label: string;
  cities: string[];
  onSelect: (city: string) => void;
}

const CityChips: React.FC<CityChipsProps> = ({ label, cities, onSelect }) => {
  if (cities.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className="flex flex-col gap-2">
      <span className="text-sm font-bold uppercase tracking-wide text-text-secondary dark:text-dark-text-secondary">
        {label}
      </span>
      <ul className="flex flex-wrap gap-2">
        {cities.map((city) => (
          <li key={city}>
            <button
              type="button"
              onClick={() => onSelect(city)}
              className="px-3 py-1 text-sm font-bold bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary
                        border-2 border-text-primary dark:border-dark-text-primary
                        hover:translate-y-[-2px] transition-transform"
            >
              {city}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CityChips;
