import React from 'react';
import { LogIn, CreditCard, FileSpreadsheet, Download } from 'lucide-react';

export const HowTo: React.FC = () => {
  const steps = [
    {
      icon: <LogIn className="w-6 h-6" />,
      title: "Inicia sessió",
      description: "Accedeix a l'àrea personal de T-mobilitat",
      link: "https://t-mobilitat.atm.cat/web/t-mobilitat/area-personal/llistat-de-suports"
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: "Històric",
      description: "A 'Accions', selecciona 'Històric de moviments de suport'"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Descarrega",
      description: "Selecciona període i 'Validació d'entrada', després descarrega en Excel"
    }
  ];

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-bold text-center mb-8 text-gray-800">
        Com obtenir el teu històric de viatges?
      </h2>
      
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {steps.map((step, index) => (
          <div 
            key={index}
            className="relative bg-gradient-to-br from-[#86c04d]/5 to-[#009889]/5
                     rounded-xl p-6 border border-[#86c04d]/10"
          >
            {/* Connection line for desktop */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#86c04d] to-[#009889]" />
            )}
            
            {/* Connection line for mobile */}
            {index < steps.length - 1 && (
              <div className="md:hidden absolute left-1/2 -bottom-3 w-0.5 h-6 bg-gradient-to-b from-[#86c04d] to-[#009889]" />
            )}
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#86c04d] to-[#009889]
                          flex items-center justify-center shadow-md">
                <div className="text-white">
                  {step.icon}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
                
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-sm text-[#009889] hover:text-[#86c04d]
                             transition-colors duration-200"
                  >
                    Visitar →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};