import React from 'react';
import { LoanStatus, statusLabels } from '../../constants/loanStatus';

interface StatusBadgeProps {
  status: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // We'll use the statusLabels from constants instead of duplicating the logic
  const getStatusStyles = () => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case LoanStatus.OVERDUE:
        return 'bg-yellow-100 text-yellow-800';
      case LoanStatus.RETURNED:
        return 'bg-gray-100 text-gray-800';
      case LoanStatus.LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}
    >
      {statusLabels[status] || 'Unknown'}
    </span>
  );
};

export default StatusBadge; 