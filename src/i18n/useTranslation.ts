import { useLanguageStore } from '../store/languageStore';
import { getLocale, translate } from './translate';
import type { MessageKey } from './messages';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);

  return {
    language,
    locale: getLocale(language),
    t: (key: MessageKey, params?: Record<string, string | number>) => translate(language, key, params),
  };
};
