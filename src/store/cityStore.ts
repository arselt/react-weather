import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CityState {
  city: string;
  setCity: (city: string) => void;
}

export const useCityStore = create<CityState>()(
  persist(
    (set) => ({
      city: "Torreon",
      
      setCity: (city: string) => {
        set({ city });
      },
    }),
    {
      name: "city-store",
    }
  )
); 