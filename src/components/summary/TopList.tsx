import React from "react";

interface TopListProps {
  items: Array<{
    name: string;
    count: number;
  }>;
}

export const TopList: React.FC<TopListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.name} className="flex justify-between items-center">
          <span className="text-lg md:text-xl text-gray-700">
            {index + 1}. {item.name}
          </span>
          {/* <span className="text-lg md:text-xl font-semibold text-[#009889]">
            {item.count} viatges
          </span> */}
          <p className="text-lg md:text-xl font-semibold text-[#009889]">
            {item.count} viatges
          </p>
        </div>
      ))}
    </div>
  );
};
