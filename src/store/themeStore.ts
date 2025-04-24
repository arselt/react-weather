import { create } from "zustand";

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: "light",

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.classList.toggle("dark", theme === "dark");
  },

  toggleTheme: () => {
    const current = get().theme;
    const newTheme = current === "light" ? "dark" : "light";
    set({ theme: newTheme});
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }
}));
