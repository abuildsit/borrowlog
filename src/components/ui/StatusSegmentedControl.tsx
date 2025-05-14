import React from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface StatusSegmentedControlProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
}

const StatusSegmentedControl: React.FC<StatusSegmentedControlProps> = ({
  selectedStatuses,
  onChange
}) => {
  const toggleStatus = (status: number) => {
    let newSelectedStatuses: number[];
    
    if (selectedStatuses.includes(status)) {
      // Remove if already selected
      newSelectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      // Add if not selected
      newSelectedStatuses = [...selectedStatuses, status];
    }
    
    // Ensure we always have at least one status selected
    if (newSelectedStatuses.length === 0) {
      return; // Don't allow removing all filters
    }
    
    onChange(newSelectedStatuses);
  };

  // Get status badge color
  const getStatusColor = (status: number, isSelected: boolean) => {
    if (!isSelected) return 'bg-transparent';
    
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
    <div className="space-y-4">
      <div className="text-sm font-medium text-gray-700">Status Filter</div>
      
      <div className="inline-flex p-1 bg-gray-100 rounded-lg shadow-sm">
        {ALL_STATUS_CODES.map(status => {
          const isSelected = selectedStatuses.includes(status);
          
          return (
            <button
              key={status}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-md transition-all
                ${isSelected 
                  ? 'text-white shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-200'
                }
              `}
              onClick={() => toggleStatus(status)}
            >
              {/* Colored background that appears when selected */}
              <span 
                className={`absolute inset-0 rounded-md transition-all ${getStatusColor(status, isSelected)}`}
              ></span>
              
              {/* Text content that stays on top */}
              <span className="relative">{statusLabels[status]}</span>
              
              {/* Selected indicator dot */}
              {isSelected && (
                <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-white border-2 border-current"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSegmentedControl; 