import React, { useState } from 'react';
import StatusDropdown from '../components/ui/StatusDropdown';
import { statusLabels } from '../constants/loanStatus';

// Example component showing how to use the StatusDropdown
const HomeExample: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  
  const handleStatusChange = (status: number | 'all') => {
    setStatusFilter(status);
    
    // Here you would filter your loans based on the status
    // If status === 'all', show all loans
    // Otherwise, filter loans where loan.status === status (numeric comparison)
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 pb-2">
        <div className="w-40">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <StatusDropdown 
            value={statusFilter} 
            onChange={handleStatusChange} 
          />
        </div>
        
        {/* Display loans filtered by status */}
        <div>
          {statusFilter === 'all' ? (
            <p>Showing all loans</p>
          ) : (
            <p>Showing loans with status: {statusLabels[statusFilter]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeExample; 