import React from 'react';

interface StatusBadgeProps {
  status: number;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Map numeric status to human-readable label
  const getStatusLabel = (statusCode: number): string => {
    switch (statusCode) {
      case 1:
        return 'Active';
      case 2:
        return 'Overdue';
      case 3:
        return 'Returned';
      default:
        return 'Unknown';
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 1: // Active
        return 'bg-green-100 text-green-800';
      case 2: // Overdue
        return 'bg-yellow-100 text-yellow-800';
      case 3: // Returned
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}
    >
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge; 