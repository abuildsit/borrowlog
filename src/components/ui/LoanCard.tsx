import React from 'react';
import { Link } from 'react-router-dom';
import { format, isPast } from 'date-fns';
import { Loan } from '../../types';
import StatusBadge from './StatusBadge';

interface LoanCardProps {
  loan: Loan;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return isPast(new Date(dueDate));
  };

  return (
    <Link
      to={`/loans/${loan.id}`}
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex">
        <div className="w-24 h-24 bg-gray-200 flex-shrink-0">
          {loan.photo_url && (
            <img
              src={loan.photo_url}
              alt={loan.item_name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="p-4 flex-grow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">{loan.item_name}</h3>
              <p className="text-sm text-gray-500">
                {loan.is_lending ? 'Lending' : 'Borrowing'}
              </p>
            </div>
            <div>
              <StatusBadge status={loan.status} />
            </div>
          </div>
          {loan.status === 'Returned' && loan.return_date ? (
            <p className="text-xs mt-2 text-gray-500">
              Returned: {format(new Date(loan.return_date), 'MMM d, yyyy')}
            </p>
          ) : loan.due_date && (
            <p className={`text-xs mt-2 ${isOverdue(loan.due_date) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              Due: {format(new Date(loan.due_date), 'MMM d, yyyy')}
              {isOverdue(loan.due_date) && ' (Overdue)'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LoanCard; 