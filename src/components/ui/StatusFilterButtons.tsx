import React from 'react';
import { LoanStatus, statusLabels } from '../../constants/loanStatus';

interface StatusFilterButtonsProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
}

const StatusFilterButtons: React.FC<StatusFilterButtonsProps> = ({
  selectedStatuses,
  onChange
}) => {
  // Available statuses for filtering
  const statuses = [
    LoanStatus.ACTIVE,
    LoanStatus.OVERDUE,
    LoanStatus.RETURNED,
    LoanStatus.LOST
  ];
  
  const getStatusIcon = (status: number) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case LoanStatus.OVERDUE:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case LoanStatus.RETURNED:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case LoanStatus.LOST:
        return (
          <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16H12.01M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };
  
  const getButtonClasses = (status: number) => {
    const isSelected = selectedStatuses.includes(status);
    const baseClasses = "px-4 py-2 rounded-full flex items-center justify-center border";
    
    if (isSelected) {
      switch (status) {
        case LoanStatus.ACTIVE:
          return `${baseClasses} bg-green-100 text-green-800 border-green-500`;
        case LoanStatus.OVERDUE:
          return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-500`;
        case LoanStatus.RETURNED:
          return `${baseClasses} bg-gray-200 text-gray-800 border-gray-400`;
        case LoanStatus.LOST:
          return `${baseClasses} bg-gray-100 text-gray-800 border-gray-400`;
        default:
          return `${baseClasses} bg-blue-100 text-blue-800 border-blue-500`;
      }
    } else {
      return `${baseClasses} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`;
    }
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
    
    // Prevent empty selection
    if (newSelectedStatuses.length === 0) {
      return;
    }
    
    onChange(newSelectedStatuses);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700">Filter by Status</div>
      <div className="flex flex-wrap gap-2">
        {statuses.map(status => (
          <button
            key={status}
            type="button"
            className={getButtonClasses(status)}
            onClick={() => toggleStatus(status)}
          >
            {getStatusIcon(status)} {statusLabels[status]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusFilterButtons; 