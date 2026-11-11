import React, { useState, FormEvent, ChangeEvent } from 'react';

interface SearchBarProps {
  initialCity: string;
  onSearch: (city: string) => void;
  onLocate: () => void;
  isLocating: boolean;
}

export const SEARCH_INPUT_ID = 'city-search';

const SearchBar: React.FC<SearchBarProps> = ({ initialCity, onSearch, onLocate, isLocating }) => {
  const [city, setCity] = useState(initialCity);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (trimmedCity) {
      onSearch(trimmedCity);
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-3 w-full">
      <form role="search" onSubmit={handleSubmit} className="flex w-full brutal-shadow">
        <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
          City name
        </label>
        <input
          id={SEARCH_INPUT_ID}
          type="text"
          placeholder="Enter city name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          enterKeyHint="search"
          className="min-w-0 flex-grow px-4 py-3 border-2 border-text-primary dark:border-dark-text-primary
                    bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary font-medium
                    outline-none focus-visible:outline-solid focus-visible:outline-3 focus-visible:-outline-offset-[6px] focus-visible:outline-accent
                    dark:focus-visible:outline-dark-accent placeholder:text-text-secondary dark:placeholder:text-dark-text-secondary"
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

      <button
        type="button"
        onClick={onLocate}
        disabled={isLocating}
        className="self-start px-4 py-2 bg-surface dark:bg-dark-surface text-text-primary dark:text-dark-text-primary font-bold
                  border-2 border-text-primary dark:border-dark-text-primary brutal-shadow
                  hover:translate-y-[-2px] transition-transform disabled:opacity-60 disabled:cursor-wait disabled:hover:translate-y-0"
        data-analytics="locate-button"
      >
        {isLocating ? 'Locating…' : 'Use my location'}
      </button>
    </div>
  );
};

export default SearchBar;
