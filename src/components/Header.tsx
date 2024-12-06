import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="w-full py-8 bg-gradient-to-r from-[#86c04d] from-30% to-[#009889] to-89%">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <img 
            src="https://t-mobilitat.atm.cat/o/t-mobilitat72-theme/images/t-mobilitat/logo-t-mobilitat.svg" 
            alt="T-Mobilitat Logo" 
            className="h-12 w-auto" // Changed from h-16 to h-12
          />
          <h1 className="text-5xl font-bold text-white tracking-wide">
            Wrapped
          </h1>
        </div>
      </div>
    </div>
  );
};