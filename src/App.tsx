import Header from "./components/Header.tsx";
import Footer from "./components/Footer";
import CurrentWeather from "./components/Weather/CurrentWeather";
import SearchBar from "./components/SearchBar";
import { useCityStore } from "./store/cityStore";

function App() {
  const { city, setCity } = useCityStore();

  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg dark:bg-dark-bg">
      <Header />
      <main className="flex-grow flex flex-col px-4 py-8 text-text-primary dark:text-dark-text-primary">
        <div className="max-w-3xl mx-auto w-full">
          <SearchBar initialCity={city} onSearch={handleSearch} />
          <CurrentWeather city={city} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
