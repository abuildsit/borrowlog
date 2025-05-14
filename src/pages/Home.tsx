import React from 'react';
import { Link } from 'react-router-dom';
import { useLoans } from '../hooks/useLoans';
import LoanCard from '../components/ui/LoanCard';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const { 
    loans, 
    loading, 
    filters, 
    applyFilters 
  } = useLoans();

  if (loading) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Your Loans</h1>
        <Link to="/loans/create">
          <Button variant="primary" size="sm">Add New Loan</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 pb-2">
        <div className="w-40">
          <FormField
            label="Status"
            name="statusFilter"
            type="select"
            value={filters.status}
            onChange={(e) => applyFilters({ status: e.target.value as any })}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Active', label: 'Active' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Returned', label: 'Returned' }
            ]}
          />
        </div>

        <div className="w-40">
          <FormField
            label="Type"
            name="typeFilter"
            type="select"
            value={filters.type}
            onChange={(e) => applyFilters({ type: e.target.value as any })}
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'lending', label: 'Lending' },
              { value: 'borrowing', label: 'Borrowing' }
            ]}
          />
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
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