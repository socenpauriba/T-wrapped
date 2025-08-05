import React from "react";
import { useTranslation } from 'react-i18next';

interface TopListProps {
  items: Array<{
    name: string;
    count: number;
  }>;
}

export const TopList: React.FC<TopListProps> = ({ items }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.name} className="flex justify-between items-center">
          <span className="text-lg md:text-xl text-gray-700">
            {index + 1}. {item.name}
          </span>
          <p className="text-lg md:text-xl font-semibold text-[#009889]">
            {item.count} {t('summary.trips')}
          </p>
        </div>
      ))}
    </div>
  );
};
