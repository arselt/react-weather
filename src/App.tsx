import { useEffect, useState } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer";
import CurrentWeather from "./components/Weather/CurrentWeather";
import SearchBar, { SEARCH_INPUT_ID } from "./components/SearchBar";
import SidebarSection from "./components/SidebarSection";
import CityList from "./components/CityList";
import Preferences from "./components/Preferences";
import { useCityStore } from "./store/cityStore";
import { useRecentCitiesStore } from "./store/recentCitiesStore";
import { useFavoriteCitiesStore } from "./store/favoriteCitiesStore";
import { useWeatherStore } from "./store/weatherStore";
import { getCurrentPosition } from "./services/geolocation";
import { analyticsService } from "./services/analyticsService";
import { useTranslation } from "./i18n/useTranslation";
import { LocationError } from "./services/geolocation";
import { useLanguageStore } from "./store/languageStore";

const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

function App() {
  const city = useCityStore((state) => state.city);
  const setCity = useCityStore((state) => state.setCity);
  const recentCities = useRecentCitiesStore((state) => state.cities);
  const clearRecentCities = useRecentCitiesStore((state) => state.clearCities);
  const favoriteCities = useFavoriteCitiesStore((state) => state.cities);
  const toggleFavoriteCity = useFavoriteCitiesStore((state) => state.toggleCity);
  const [isLocating, setIsLocating] = useState(false);
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  // Keep the document language and title in sync with the chosen language
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('document.title');
  }, [language, t]);

  // Load the last searched city on startup, and track the page view
  useEffect(() => {
    analyticsService.pageView('/', 'Weather App Homepage');
    void useWeatherStore.getState().loadWeather({ type: 'city', city: useCityStore.getState().city });
  }, []);

  // "/" jumps to the search box, unless the user is already typing somewhere
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearch = (newCity: string) => {
    setCity(newCity);
    void useWeatherStore.getState().loadWeather({ type: 'city', city: newCity });
  };

  const handleLocate = async () => {
    setIsLocating(true);
    try {
      const { lat, lon } = await getCurrentPosition();
      await useWeatherStore.getState().loadWeather({ type: 'coords', lat, lon });
    } catch (error) {
      useWeatherStore.getState().setError(
        error instanceof LocationError ? error.key : 'error.locationUnavailable',
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-dark-bg">
      <Header />
      <main className="flex-grow px-4 py-8 text-text-primary dark:text-dark-text-primary">
        {/*
          Mobile: search, then the weather, then the lists.
          Desktop: search and lists in the left column, weather on the right.
        */}
        <div className="mx-auto w-full max-w-6xl grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div className="lg:col-start-1 lg:row-start-1">
            <SearchBar
              initialCity={city}
              onSearch={handleSearch}
              onLocate={handleLocate}
              isLocating={isLocating}
            />
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <CurrentWeather />
          </div>

          <aside className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2" aria-label={t('section.preferences')}>
            <SidebarSection id="saved-cities-title" title={t('section.saved')}>
              <CityList
                cities={favoriteCities}
                emptyText={t('saved.empty')}
                onSelect={handleSearch}
                onRemove={toggleFavoriteCity}
              />
            </SidebarSection>

            <SidebarSection
              id="recent-cities-title"
              title={t('section.recent')}
              action={recentCities.length > 0 && (
                <button
                  type="button"
                  onClick={clearRecentCities}
                  className="text-sm font-bold underline underline-offset-4 text-text-primary dark:text-dark-text-primary hover:text-link dark:hover:text-dark-accent"
                >
                  {t('recent.clear')}
                </button>
              )}
            >
              <CityList
                cities={recentCities}
                emptyText={t('recent.empty')}
                onSelect={handleSearch}
              />
            </SidebarSection>

            <SidebarSection id="preferences-title" title={t('section.preferences')}>
              <Preferences />
            </SidebarSection>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
