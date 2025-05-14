import React, { useState, useRef, useEffect } from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface MultiSelectDropdownProps {
  selectedValues: number[];
  onChange: (selected: number[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  selectedValues,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (value: number) => {
    let newSelected: number[];
    
    if (selectedValues.includes(value)) {
      newSelected = selectedValues.filter(v => v !== value);
    } else {
      newSelected = [...selectedValues, value];
    }
    
    // Prevent empty selection
    if (newSelected.length === 0) return;
    
    onChange(newSelected);
  };

  // Get color for status indicator dots
  const getStatusColor = (status: number) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'bg-green-500';
      case LoanStatus.OVERDUE:
        return 'bg-yellow-500';
      case LoanStatus.RETURNED:
        return 'bg-gray-500';
      case LoanStatus.LOST:
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className="flex justify-between items-center w-full rounded border border-gray-300 px-4 py-2 bg-white text-sm font-medium text-gray-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Status</span>
        <span className="ml-2 text-gray-400">▾</span>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          <div className="py-1 max-h-60 overflow-auto">
            {ALL_STATUS_CODES.map(value => (
              <div
                key={value}
                className={`
                  flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100
                  ${selectedValues.includes(value) ? 'bg-blue-50' : ''}
                `}
                onClick={() => toggleOption(value)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => {}} // Handled by parent div click
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(value)}`}></div>
                  <span>{statusLabels[value]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown; 