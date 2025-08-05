import React from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, CreditCard, FileSpreadsheet, Download } from 'lucide-react';

export const HowTo: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <LogIn className="w-6 h-6" />,
      title: t('howTo.step1.title'),
      description: t('howTo.step1.description'),
      link: "https://t-mobilitat.atm.cat/"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: t('howTo.step2.title'),
      description: t('howTo.step2.description')
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: t('howTo.step3.title'),
      description: t('howTo.step3.description')
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: t('howTo.step4.title'),
      description: t('howTo.step4.description')
    }
  ];

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-bold text-center mb-8 text-gray-800">
        {t('howTo.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    {t('howTo.visit')}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};