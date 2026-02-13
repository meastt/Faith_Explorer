import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enSearch from './locales/en/search.json';
import enLibrary from './locales/en/library.json';
import enLearn from './locales/en/learn.json';
import enSettings from './locales/en/settings.json';

import esCommon from './locales/es/common.json';
import esSearch from './locales/es/search.json';
import esLibrary from './locales/es/library.json';
import esLearn from './locales/es/learn.json';
import esSettings from './locales/es/settings.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        search: enSearch,
        library: enLibrary,
        learn: enLearn,
        settings: enSettings,
      },
      es: {
        common: esCommon,
        search: esSearch,
        library: esLibrary,
        learn: esLearn,
        settings: esSettings,
      },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es'],
    defaultNS: 'common',
    ns: ['common', 'search', 'library', 'learn', 'settings'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'faith-explorer-language',
      caches: ['localStorage'],
    },
  });

export default i18n;
