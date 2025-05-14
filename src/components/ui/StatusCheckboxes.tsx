import React from 'react';
import { LoanStatus, statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface StatusCheckboxesProps {
  selectedStatuses: number[];
  onChange: (selectedStatuses: number[]) => void;
}

const StatusCheckboxes: React.FC<StatusCheckboxesProps> = ({
  selectedStatuses,
  onChange
}) => {
  const handleCheckboxChange = (status: number) => {
    let newSelectedStatuses: number[];
    
    if (selectedStatuses.includes(status)) {
      // Remove if already selected
      newSelectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      // Add if not selected
      newSelectedStatuses = [...selectedStatuses, status];
    }
    
    onChange(newSelectedStatuses);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-700 mb-1">Status</div>
      
      <div className="flex flex-col gap-2">
        {ALL_STATUS_CODES.map(status => (
          <label key={status} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedStatuses.includes(status)}
              onChange={() => handleCheckboxChange(status)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{statusLabels[status]}</span>
          </label>
        ))}
      </div>

      {selectedStatuses.length === 0 && (
        <div className="text-xs text-red-500 mt-1">
          Please select at least one status
        </div>
      )}
    </div>
  );
};

export default StatusCheckboxes; 