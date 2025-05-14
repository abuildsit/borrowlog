import React from 'react';
import { getLoanStatusLabel, LoanStatus } from '../../constants/loanStatus';

interface StatusBadgeProps {
  status: number;
}

const StatusBadgeExample: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 2:
        return 'bg-yellow-100 text-yellow-800';
      case 3:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}
    >
      {getLoanStatusLabel(status)}
    </span>
  );
};

export default StatusBadgeExample; 