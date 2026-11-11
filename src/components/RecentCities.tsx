import React from 'react';

interface RecentCitiesProps {
  cities: string[];
  onSelect: (city: string) => void;
}

const RecentCities: React.FC<RecentCitiesProps> = ({ cities, onSelect }) => {
  if (cities.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Recent searches" className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Recent:</span>
      {cities.map((city) => (
        <button
          key={city}
          type="button"
          onClick={() => onSelect(city)}
          className="px-3 py-1 text-sm font-bold bg-bg dark:bg-dark-bg text-text-primary dark:text-dark-text-primary
                    border-2 border-text-primary dark:border-dark-text-primary
                    hover:translate-y-[-2px] transition-transform"
        >
          {city}
        </button>
      ))}
    </nav>
  );
};

export default RecentCities;
