import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-[#86c04d]/10 to-[#009889]/10 rounded-lg 
                   border border-[#86c04d]/20">
      <div className="flex items-center space-x-3 mb-4">
        <Icon className="w-6 h-6 text-[#86c04d]" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );
};