import React from 'react';
import { Link } from 'react-router-dom';
import { useLoans } from '../hooks/useLoans';
import LoanCard from '../components/ui/LoanCard';
import MultiSelectDropdown from '../components/ui/MultiSelectDropdown';

// Status constants
const STATUS_ACTIVE = 1;
const STATUS_OVERDUE = 2;
const STATUS_RETURNED = 3;

const Home: React.FC = () => {
  const { 
    loans, 
    loading, 
    filters, 
    applyFilters,
    DEFAULT_STATUS_FILTERS
  } = useLoans();

  const handleStatusChange = (selectedStatuses: number[]) => {
    applyFilters({ ...filters, statusFilters: selectedStatuses });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyFilters({ ...filters, type: e.target.value as any });
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <Link to="/loans/create">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Add New Loan
          </button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="w-64">
          <select
            id="type-filter"
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm font-medium text-gray-700"
            value={filters.type}
            onChange={handleTypeChange}
          >
            <option value="all">All Types</option>
            <option value="lending">Lending</option>
            <option value="borrowing">Borrowing</option>
          </select>
        </div>
        
        <div className="w-64">
          <MultiSelectDropdown
            selectedValues={filters.statusFilters === 'all' ? [] : filters.statusFilters}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-gray-500">No loans found</p>
          <p className="text-gray-500 mt-1 text-sm">
            Get started by adding a new loan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loans.map((loan) => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 