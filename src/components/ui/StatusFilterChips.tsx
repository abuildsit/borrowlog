import React from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';
import { Loan } from '../../types';

interface StatusFilterChipsProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
  loans: Loan[]; // To display count of each status
}

const StatusFilterChips: React.FC<StatusFilterChipsProps> = ({
  selectedStatuses,
  onChange,
  loans
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

  // Count loans by status
  const getLoanCountByStatus = (status: number): number => {
    return loans.filter(loan => loan.status === status).length;
  };

  // Get status chip style
  const getChipStyle = (status: number, isSelected: boolean) => {
    // Base style
    let baseStyle = "flex items-center gap-2 px-3 py-2 rounded-full font-medium transition-all";
    
    if (isSelected) {
      switch (status) {
        case LoanStatus.ACTIVE:
          return `${baseStyle} bg-green-100 text-green-800 border border-green-300`;
        case LoanStatus.OVERDUE:
          return `${baseStyle} bg-yellow-100 text-yellow-800 border border-yellow-300`;
        case LoanStatus.RETURNED:
          return `${baseStyle} bg-gray-100 text-gray-800 border border-gray-300`;
        case LoanStatus.LOST:
          return `${baseStyle} bg-red-100 text-red-800 border border-red-300`;
        default:
          return `${baseStyle} bg-blue-100 text-blue-800 border border-blue-300`;
      }
    } else {
      return `${baseStyle} bg-white text-gray-600 border border-gray-300 hover:bg-gray-50`;
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">Filter by Status</div>
      
      <div className="flex flex-wrap gap-2">
        {ALL_STATUS_CODES.map(status => {
          const isSelected = selectedStatuses.includes(status);
          const count = getLoanCountByStatus(status);
          
          return (
            <button
              key={status}
              className={getChipStyle(status, isSelected)}
              onClick={() => toggleStatus(status)}
            >
              <span>{statusLabels[status]}</span>
              
              {/* Count badge */}
              <span className={`
                inline-flex items-center justify-center w-5 h-5 text-xs rounded-full
                ${isSelected ? 'bg-white' : 'bg-gray-200'}
              `}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFilterChips; 