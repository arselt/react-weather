import React, { useState, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
  initialCity: string;
  onSearch: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialCity, onSearch }) => {
  const [city, setCity] = useState(initialCity);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  // Search is tracked in weatherStore, so it is not tracked here too
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (trimmedCity) {
      onSearch(trimmedCity);
    }
  };

  return (
    <div className="mb-6 flex justify-center w-full">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex w-full brutal-shadow"
      >
        <label htmlFor="city-search" className="sr-only">
          City name
        </label>
        <input
          id="city-search"
          type="search"
          placeholder="Enter city name"
          autoComplete="off"
          className="px-4 py-3 border-2 border-text-primary dark:border-dark-text-primary flex-grow w-full
                    bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary
                    outline-none font-medium"
          value={city}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-accent dark:bg-dark-accent text-text-primary dark:text-dark-bg font-bold
                    border-2 border-l-0 border-text-primary dark:border-dark-text-primary
                    hover:translate-y-[-2px] transition-transform"
          data-analytics="search-button"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
