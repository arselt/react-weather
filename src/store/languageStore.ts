import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { detectLanguage, type Language } from '../i18n/translate';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectLanguage(navigator.language ?? 'en'),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'language',
    }
  )
);
