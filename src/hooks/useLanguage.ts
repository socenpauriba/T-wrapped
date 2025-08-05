import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import type { SupportedLanguages } from '../i18n/types';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.language as SupportedLanguages;
  
  const changeLanguage = useCallback((languageCode: SupportedLanguages) => {
    if (SUPPORTED_LANGUAGES.includes(languageCode)) {
      i18n.changeLanguage(languageCode);
    } else {
      console.warn(`Unsupported language: ${languageCode}. Falling back to ${DEFAULT_LANGUAGE}`);
      i18n.changeLanguage(DEFAULT_LANGUAGE);
    }
  }, [i18n]);

  const isLanguageSupported = useCallback((languageCode: string): languageCode is SupportedLanguages => {
    return SUPPORTED_LANGUAGES.includes(languageCode as SupportedLanguages);
  }, []);

  const getLanguageDirection = useCallback((languageCode?: SupportedLanguages) => {
    const lang = languageCode || currentLanguage;
    return 'ltr';
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    isLanguageSupported,
    getLanguageDirection,
    t,
    supportedLanguages: SUPPORTED_LANGUAGES,
    defaultLanguage: DEFAULT_LANGUAGE,
    isReady: i18n.isInitialized
  };
};
