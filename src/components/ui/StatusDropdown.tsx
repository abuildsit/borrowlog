import React from 'react';
import { statusLabels, ALL_STATUS_CODES } from '../../constants/loanStatus';

interface StatusDropdownProps {
  value: number | 'all';
  onChange: (status: number | 'all') => void;
  includeAll?: boolean;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({
  value,
  onChange,
  includeAll = true
}) => {
  return (
    <select
      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
      value={value}
      onChange={(e) => {
        // Convert back to numeric value or 'all'
        const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
        onChange(val);
      }}
    >
      {includeAll && (
        <option value="all">All Statuses</option>
      )}
      
      {ALL_STATUS_CODES.map(statusCode => (
        <option key={statusCode} value={statusCode}>
          {statusLabels[statusCode]}
        </option>
      ))}
    </select>
  );
};

export default StatusDropdown; 