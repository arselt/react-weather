import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { analyticsService } from '../services/analyticsService';

interface SearchBarProps {
  initialCity: string;
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialCity, onSearch }) => {
  const [city, setCity] = useState(initialCity);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      // Track the search event
      analyticsService.trackSearch(city, 'city');
      onSearch(city);
    }
  };

  return (
    <div className="mb-6 flex justify-center w-full">
      <div className="flex w-full shadow-[5px_5px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.5)]">
        <input
          type="text"
          placeholder="Enter city name"
          className="px-4 py-3 border-2 border-text-primary dark:border-dark-text-primary flex-grow w-full 
                    bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary 
                    outline-none font-medium"
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          className="px-6 py-3 bg-accent dark:bg-dark-accent text-white font-bold 
                    border-2 border-l-0 border-text-primary dark:border-dark-text-primary 
                    hover:translate-y-[-2px] transition-transform"
          onClick={handleSearch}
          data-analytics="search-button"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar; 