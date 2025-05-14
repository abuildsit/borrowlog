import React from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface StatusToggleButtonsProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
}

const StatusToggleButtons: React.FC<StatusToggleButtonsProps> = ({
  selectedStatuses,
  onChange
}) => {
  // Status icons (Material Icons names)
  const statusIcons: Record<number, string> = {
    [LoanStatus.ACTIVE]: 'schedule',
    [LoanStatus.OVERDUE]: 'warning',
    [LoanStatus.RETURNED]: 'check_circle',
    [LoanStatus.LOST]: 'help'
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
      <div className="text-sm font-medium text-gray-700">Filter by Status</div>
      
      <div className="flex gap-2">
        {ALL_STATUS_CODES.map(status => {
          const isSelected = selectedStatuses.includes(status);
          
          // Different colors based on status
          let buttonClass = "flex flex-col items-center justify-center p-3 rounded-lg transition-all";
          let iconClass = "material-icons text-xl mb-1";
          
          if (isSelected) {
            switch (status) {
              case LoanStatus.ACTIVE:
                buttonClass += " bg-green-100 text-green-800 border-2 border-green-500";
                iconClass += " text-green-700";
                break;
              case LoanStatus.OVERDUE:
                buttonClass += " bg-yellow-100 text-yellow-800 border-2 border-yellow-500";
                iconClass += " text-yellow-700";
                break;
              case LoanStatus.RETURNED:
                buttonClass += " bg-gray-200 text-gray-800 border-2 border-gray-500";
                iconClass += " text-gray-700";
                break;
              case LoanStatus.LOST:
                buttonClass += " bg-red-100 text-red-800 border-2 border-red-500";
                iconClass += " text-red-700";
                break;
            }
          } else {
            buttonClass += " bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-gray-100";
          }
          
          return (
            <button 
              key={status}
              className={buttonClass}
              onClick={() => toggleStatus(status)}
            >
              <span className={iconClass}>{statusIcons[status]}</span>
              <span className="text-xs font-medium">{statusLabels[status]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusToggleButtons; 