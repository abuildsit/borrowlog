import React from 'react';

type StatusType = 'Active' | 'Overdue' | 'Returned';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-yellow-100 text-yellow-800';
      case 'Returned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge; 