import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toggleFavoriteCity } from "../utils/weather";

interface FavoriteCitiesState {
  cities: string[];
  toggleCity: (city: string) => void;
}

export const useFavoriteCitiesStore = create<FavoriteCitiesState>()(
  persist(
    (set, get) => ({
      cities: [],

      toggleCity: (city: string) => {
        set({ cities: toggleFavoriteCity(get().cities, city) });
      },
    }),
    {
      name: "favorite-cities",
    }
  )
);
