import React from 'react';

type StatusType = 'active' | 'pending_return' | 'completed';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_return':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getStatusStyles()}`}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge; 