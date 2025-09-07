import React from 'react';

interface FilterChipsProps {
  options: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  primaryColor: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({ 
  options, 
  activeFilter, 
  onFilterChange, 
  primaryColor 
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onFilterChange(option)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 ${
            activeFilter === option
              ? 'text-white shadow-lg'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
          style={{
            backgroundColor: activeFilter === option ? primaryColor : undefined,
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default FilterChips;