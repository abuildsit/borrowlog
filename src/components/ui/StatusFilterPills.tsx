import React from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface StatusFilterPillsProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
}

const StatusFilterPills: React.FC<StatusFilterPillsProps> = ({
  selectedStatuses,
  onChange
}) => {
  const getStatusStyles = (status: number) => {
    const isSelected = selectedStatuses.includes(status);
    
    // Base styles
    let baseStyles = "px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer";
    
    // Selected/unselected styles
    if (!isSelected) {
      baseStyles += " bg-gray-100 text-gray-700 hover:bg-gray-200";
    } else {
      // Different colors based on status
      switch (status) {
        case LoanStatus.ACTIVE:
          return `${baseStyles} bg-green-100 text-green-800 border-2 border-green-500`;
        case LoanStatus.OVERDUE:
          return `${baseStyles} bg-yellow-100 text-yellow-800 border-2 border-yellow-500`;
        case LoanStatus.RETURNED:
          return `${baseStyles} bg-gray-200 text-gray-800 border-2 border-gray-500`;
        case LoanStatus.LOST:
          return `${baseStyles} bg-red-100 text-red-800 border-2 border-red-500`;
        default:
          return `${baseStyles} bg-blue-100 text-blue-800 border-2 border-blue-500`;
      }
    }
    
    return baseStyles;
  };

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

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700 mb-1">Filter by Status</div>
      
      <div className="flex flex-wrap gap-2">
        {ALL_STATUS_CODES.map(status => (
          <div 
            key={status}
            className={getStatusStyles(status)}
            onClick={() => toggleStatus(status)}
          >
            {statusLabels[status]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusFilterPills; 