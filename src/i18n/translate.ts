import { en, es, type MessageKey } from './messages.ts';

export const LANGUAGES = ['en', 'es'] as const;
export type Language = (typeof LANGUAGES)[number];

const MESSAGES: Record<Language, Record<MessageKey, string>> = { en, es };

export const isLanguage = (value: unknown): value is Language =>
  LANGUAGES.includes(value as Language);

// Spanish for any Spanish browser, English otherwise
export const detectLanguage = (browserLanguage: string): Language =>
  browserLanguage.toLowerCase().startsWith('es') ? 'es' : 'en';

// Locale used by Intl formatting (times, weekdays)
export const getLocale = (language: Language) => (language === 'es' ? 'es-MX' : 'en-US');

// Replaces {name} placeholders; unknown placeholders are left visible so gaps are easy to spot
export const translate = (
  language: Language,
  key: MessageKey,
  params: Record<string, string | number> = {},
) => {
  const template = MESSAGES[language][key] ?? en[key];
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  );
};
