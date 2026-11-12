import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { useUnitsStore } from '../store/unitsStore';
import { useLanguageStore } from '../store/languageStore';
import { analyticsService } from '../services/analyticsService';
import { useTranslation } from '../i18n/useTranslation';
import { isLanguage } from '../i18n/translate';
import SegmentedControl from './SegmentedControl';

const Preferences: React.FC = () => {
  const { t } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const { unit, setUnit } = useUnitsStore();
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        id="units-label"
        label={t('prefs.units')}
        value={unit}
        options={[
          { value: 'metric', label: '°C' },
          { value: 'imperial', label: '°F' },
        ]}
        onChange={(nextUnit) => {
          if (nextUnit === unit) return;
          analyticsService.trackButtonClick('unit-toggle', `switch-to-${nextUnit}`);
          setUnit(nextUnit);
        }}
      />

      <SegmentedControl
        id="theme-label"
        label={t('prefs.theme')}
        value={theme}
        options={[
          { value: 'light', label: t('prefs.light'), icon: '01d' },
          { value: 'dark', label: t('prefs.dark'), icon: '01n' },
        ]}
        onChange={(nextTheme) => {
          if (nextTheme === theme) return;
          analyticsService.trackButtonClick('theme-toggle', `switch-to-${nextTheme}`);
          setTheme(nextTheme);
        }}
      />

      <SegmentedControl
        id="language-label"
        label={t('prefs.language')}
        value={language}
        options={[
          { value: 'en', label: t('lang.en') },
          { value: 'es', label: t('lang.es') },
        ]}
        onChange={(nextLanguage) => {
          if (isLanguage(nextLanguage)) setLanguage(nextLanguage);
        }}
      />
    </div>
  );
};

export default Preferences;
