import React from 'react';
import { Heart, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-4 mt-12 bg-white border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            Fet amb <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> a Catalunya per{' '}
            <a 
              href="https://nuvol.cat" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              Nuvol.cat
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div>
            Desenvolupat amb{' '}
            <a 
              href="https://bolt.new" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              Bolt.new
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div className="flex items-center">
            <a 
              href="https://github.com/socenpauriba/t-wrapped" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-[#009889] hover:text-[#86c04d] transition-colors duration-200"
            >
              <Github className="w-4 h-4 mr-1" />
              Consulta el codi
            </a>
          </div>
          <span className="hidden md:inline">·</span>
          <div className="text-gray-500 text-xs text-center md:text-left">
            Projecte en clau humorística no vinculat a T-mobilitat
          </div>
        </div>
      </div>
    </footer>
  );
};