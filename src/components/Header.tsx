import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './LanguageSelector';

export const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full py-8 bg-gradient-to-r from-[#86c04d] from-30% to-[#009889] to-89%">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1"></div>
          <LanguageSelector />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <img 
            src="https://t-mobilitat.atm.cat/o/t-mobilitat72-theme/images/t-mobilitat/logo-t-mobilitat.svg" 
            alt="T-Mobilitat Logo" 
            className="h-12 w-auto"
          />
          <h1 className="text-5xl font-bold text-white tracking-wide">
            {t('header.title')}
          </h1>
        </div>
      </div>
    </div>
  );
};