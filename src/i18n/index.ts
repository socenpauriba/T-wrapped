import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { SupportedLanguages, TranslationResources } from './types';

// Import translation files
import ca from './locales/ca.json';
import es from './locales/es.json';
import en from './locales/en.json';

// Supported languages configuration
export const SUPPORTED_LANGUAGES: SupportedLanguages[] = ['ca', 'es', 'en'];
export const DEFAULT_LANGUAGE: SupportedLanguages = 'ca';

const resources = {
  ca: {
    translation: ca as TranslationResources
  },
  es: {
    translation: es as TranslationResources
  },
  en: {
    translation: en as TranslationResources
  }
};

// Language detection configuration
const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  checkWhitelist: true
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    lng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    detection: detectionOptions,
    
    // Error handling
    saveMissing: import.meta.env?.DEV || false,
    missingKeyHandler: (lngs: readonly string[], ns: string, key: string) => {
      if (import.meta.env?.DEV) {
        console.warn(`Missing translation key: ${key} for languages: ${lngs.join(', ')} in namespace: ${ns}`);
      }
    },
    
    // Performance optimizations
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p']
    }
  })
  .catch((error) => {
    console.error('Failed to initialize i18n:', error);
  });

export default i18n;
