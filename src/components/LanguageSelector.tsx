import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import type { LanguageOption, SupportedLanguages } from '../i18n/types';
import { SUPPORTED_LANGUAGES } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages: LanguageOption[] = [
    { 
      code: 'ca', 
      name: t('language.catalan'), 
      nativeName: 'Català' 
    },
    { 
      code: 'es', 
      name: t('language.spanish'), 
      nativeName: 'Español' 
    },
    { 
      code: 'en', 
      name: t('language.english'), 
      nativeName: 'English' 
    }
  ];

  const handleLanguageChange = (languageCode: SupportedLanguages) => {
    if (SUPPORTED_LANGUAGES.includes(languageCode)) {
      i18n.changeLanguage(languageCode);
    }
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const currentLangCode = i18n.language as SupportedLanguages;

  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
        aria-label={t('language.selector')}
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{currentLanguage.flag} {currentLanguage.nativeName}</span>
        <svg 
          className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg ${
              currentLangCode === language.code ? 'bg-green-50 text-green-700' : 'text-gray-700'
            }`}
            aria-label={`${t('language.selector')}: ${language.nativeName}`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-gray-500">{language.name}</span>
            </div>
            {currentLangCode === language.code && (
              <svg className="w-4 h-4 ml-auto text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
