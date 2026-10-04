import { createContext, useContext, useEffect, useMemo } from 'react';
import { DICTIONARIES } from './dictionary.js';

export const UI_LOCALES = [
  { id: 'ar', label: 'العربية', dir: 'rtl' },
  { id: 'fr', label: 'Français', dir: 'ltr' },
  { id: 'en', label: 'English', dir: 'ltr' },
];

const I18nContext = createContext({ locale: 'ar', dir: 'rtl', t: (k) => k });

export function I18nProvider({ locale, children }) {
  const value = useMemo(() => {
    const dict = DICTIONARIES[locale] || DICTIONARIES.ar;
    const dir = UI_LOCALES.find((l) => l.id === locale)?.dir || 'rtl';
    return {
      locale,
      dir,
      t: (key, vars) => {
        let out = dict[key] ?? DICTIONARIES.ar[key] ?? key;
        if (vars) for (const [k, v] of Object.entries(vars)) out = out.replace(`{${k}}`, v);
        return out;
      },
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = value.dir;
  }, [locale, value.dir]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);
export const useT = () => useContext(I18nContext).t;

/** Label of a catalog option (RECIPIENTS, OCCASIONS, …) in the current UI language. */
export function useLabel() {
  const { locale } = useI18n();
  return (item) => item?.[locale] ?? item?.ar ?? item?.en ?? '';
}
